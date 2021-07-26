import os
import json
import time

import socketio
import eventlet

from .ports import Ports
from .portable_tank_drive import PortableTankDrive
from .portable_medium_motor import PortableMediumMotor
from .portable_ultrasonic_sensor import PortableUltrasonicSensor
from .portable_color_sensor import PortableColorSensor
from .portable_touch_sensor import PortableTouchSensor

PORT = 5000
MAX_SPEED_PERCENT = 50

tank_drive = PortableTankDrive(Ports.OUTPUT_B, Ports.OUTPUT_C)
medium_motor = PortableMediumMotor(Ports.OUTPUT_A)
ultrasonic_sensor = PortableUltrasonicSensor(Ports.INPUT_3)
color_sensor = PortableColorSensor(Ports.INPUT_1)
touch_sensor = PortableTouchSensor(Ports.INPUT_2)

password = input("Choose password needed by clients to use (leave blank for none): ")

working_dir = os.path.dirname(os.path.abspath(__file__))
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
    {l_speed_percent: <int>, r_speed_percent: <int>}
    '''
    tank_drive.on(data['l_speed_percent'], data['r_speed_percent'])

@sio.event
def medium_motor_drive(sid, data):
    '''
    Expects data to be int
    '''
    medium_motor.on(data)

@sio.event
def get_sensor_data(sid):
    sio.emit('sensor_data', {
        'ultrasonic_dist' : ultrasonic_sensor.distance_cm(),
        'reflected_light' : color_sensor.reflected_light(),
        'ambient_light' : color_sensor.ambient_light(),
        'touch_sensor_pressed' : touch_sensor.is_pressed()
    }, room=sid)

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', PORT)), app)
