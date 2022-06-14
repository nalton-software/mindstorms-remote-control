import os
from aiohttp import web
import socketio
from flask import Flask, send_from_directory

from .ports import Ports
from .portable_tank_drive import PortableTankDrive
from .portable_medium_motor import PortableMediumMotor
from .portable_ultrasonic_sensor import PortableUltrasonicSensor
from .portable_color_sensor import PortableColorSensor
from .portable_touch_sensor import PortableTouchSensor

PORT = 5000

tank_drive = PortableTankDrive(Ports.OUTPUT_A, Ports.OUTPUT_D)
medium_motor = PortableMediumMotor(Ports.OUTPUT_B)
color_sensor = PortableColorSensor(Ports.INPUT_2)
touch_sensor = PortableTouchSensor(Ports.INPUT_4)
ultrasonic_sensor = PortableUltrasonicSensor(Ports.INPUT_3)

working_dir = os.path.dirname(os.path.abspath(__file__))
sio = socketio.Server(async_mode='threading')

app = Flask(__name__)
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)

@app.route('/main/<path:path>')
def serve_static(path):
    return send_from_directory('{}/frontend/'.format(working_dir), path)

@sio.on('tank_steer')
def tank_steer(sid, data):
    '''
    Expects data to be object like this:
    {l_speed_percent: <int>, r_speed_percent: <int>}
    '''
    tank_drive.on(data['l_speed_percent'], data['r_speed_percent'])

@sio.on('medium_motor_drive')
def medium_motor_drive(sid, data):
    '''
    Expects data to be int
    '''
    medium_motor.on(data)

@sio.on('get_sensor_data')
def get_sensor_data(sid):
    sio.emit('sensor_data', {
        'ultrasonic_dist' : ultrasonic_sensor.distance_cm(),
        'reflected_light' : color_sensor.reflected_light(),
        'ambient_light' : color_sensor.ambient_light(),
        'touch_sensor_pressed' : touch_sensor.is_pressed()
    }, room=sid)

if __name__ == '__main__':
    app.run(port=PORT)