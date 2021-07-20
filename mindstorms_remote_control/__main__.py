import os
import json
import time
import threading

import eventlet
import socketio

from .ports import Ports
from .portable_tank_drive import PortableTankDrive
from .portable_medium_motor import PortableMediumMotor
from .portable_ultrasonic_sensor import PortableUltrasonicSensor

PORT = 5000
MAX_SPEED_PERCENT = 50
SEND_SENSOR_DATA_INTERVAL = 0.1

working_dir = os.path.dirname(os.path.abspath(__file__))
tank_drive = PortableTankDrive(Ports.OUTPUT_B, Ports.OUTPUT_C)
medium_motor = PortableMediumMotor(Ports.OUTPUT_A)

password = input("Choose password needed by clients to use (leave blank for none): ")

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
        sio.disconnect(sid)

@sio.event
def tank_steer(sid, data):
    '''
    Expects data to be object like this:
    {l_speed_percent: <int>, r_speed_percnet: <int>}
    '''
    tank_drive.on(data['l_speed_percent'], data['r_speed_percent'])

@sio.event
def medium_motor_drive(sid, data):
    '''
    Expects data to be int
    '''
    medium_motor.on(data)

def send_sensor_data_loop():
    while True:
        sio.emit()
        time.sleep(SEND_SENSOR_DATA_INTERVAL)

if __name__ == '__main__':
    threading.Thread(target=send_sensor_data_loop)
    eventlet.wsgi.server(eventlet.listen(('', PORT)), app)
