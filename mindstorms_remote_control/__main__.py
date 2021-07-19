import os

import eventlet
import socketio

from .portable_tank_drive import PortableTankDrive

PORT = 5000
MAX_SPEED_PERCENT = 50

working_dir = os.path.dirname(os.path.abspath(__file__))
keys_down = []
tank_drive = PortableTankDrive(PortableTankDrive.OUTPUT_B, PortableTankDrive.OUTPUT_C)

password = input("Choose password needed by clients to use (leave blank for none): ")

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

    tank_drive.on(int(l_speed_percent), int(r_speed_percent))

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
    '/': f'{working_dir}/frontend/'
})

@sio.event
def connect(sid, environ, auth: str):
    '''
    Client will connect like this, where password is the password:
    socket = io.connect('', {
        auth: password,
    });
    '''
    if password != "" and auth != password:
        print("dis")
        sio.emit('invalid_password')
        sio.disconnect(sid)
        return

@sio.event
def keydown(sid, data: str):
    '''
    Expected data to be a string representing a keycode.
    '''
    set_key_down(data, True)
    update_motors()

@sio.event
def keyup(sid, data: str):
    '''
    Expected data to be a string representing a keycode.
    '''
    set_key_down(data, False)
    update_motors()

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', PORT)), app)
