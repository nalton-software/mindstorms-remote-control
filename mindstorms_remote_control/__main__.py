import os
import json
from enum import Enum

import eventlet
import socketio
import argon2

from portable_tank_drive import PortableTankDrive

PORT = 5000
PASSWORD_HASH = '$argon2id$v=19$m=102400,t=2,p=8$3/kyOZiC9W/TCMhh85c/kQ$k2unzIv3VeIHyHlhpBTojA'
MAX_SPEED_PERCENT = 50

working_dir = os.path.dirname(os.path.abspath(__file__))
password_hasher = argon2.PasswordHasher()
keys_down = []
tank_drive = PortableTankDrive(PortableTankDrive.OUTPUT_B, PortableTankDrive.OUTPUT_C)

def get_key_down(key: str):
    '''Mini helper to check if a key is down'''
    return key in keys_down

def set_key_down(key: str, key_down: bool):
    '''Mini helper to set a key being down or not'''
    if key_down and key not in keys_down:
        keys_down.append(key)
    if not key_down and key in keys_down:
        keys_down.remove(key)

def update_motors():
    '''
    Update the motors to run at the correct speed
    based on what keys are currently pressed.
    '''
    l_speed_percent = 0
    r_speed_percent = 0

    if get_key_down('ArrowUp'):
        l_speed_percent += MAX_SPEED_PERCENT
        r_speed_percent += MAX_SPEED_PERCENT
    if get_key_down('ArrowDown'):
        l_speed_percent -= MAX_SPEED_PERCENT
        r_speed_percent -= MAX_SPEED_PERCENT
    if get_key_down('ArrowLeft'):
        l_speed_percent -= MAX_SPEED_PERCENT
        r_speed_percent += MAX_SPEED_PERCENT
    if get_key_down('ArrowRight'):
        l_speed_percent += MAX_SPEED_PERCENT
        r_speed_percent -= MAX_SPEED_PERCENT
    
    # Cap percents to max speed
    if l_speed_percent > MAX_SPEED_PERCENT:
        multiplier = MAX_SPEED_PERCENT / l_speed_percent
        l_speed_percent *= multiplier
        r_speed_percent *= multiplier
    elif r_speed_percent > MAX_SPEED_PERCENT:
        multiplier = MAX_SPEED_PERCENT / r_speed_percent
        l_speed_percent *= multiplier
        r_speed_percent *= multiplier

    tank_drive.on(l_speed_percent, r_speed_percent)

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
    '/': f'{working_dir}/frontend/'
})

@sio.event
def connect(sid, environ):
    print('connect ', sid)

@sio.event
def keydown(sid, data: str):
    '''
    Expected JSON:
    {password: 'some string', key: 'ArrowUp'}
    '''
    data = json.loads(data)
    try:
        if password_hasher.verify(PASSWORD_HASH, data['password']):
            set_key_down(data['key'], True)
            update_motors()
    except (argon2.exceptions.InvalidHash, argon2.exceptions.VerifyMismatchError):
        sio.emit('invalid_password')

@sio.event
def keyup(sid, data: str):
    '''
    Expected JSON:
    {password: 'some string', key: 'ArrowUp'}
    '''
    data = json.loads(data)
    try:
        if password_hasher.verify(PASSWORD_HASH, data['password']):
            set_key_down(data['key'], False)
            update_motors()
    except (argon2.exceptions.InvalidHash, argon2.exceptions.VerifyMismatchError):
        sio.emit('invalid_password')

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', PORT)), app)
