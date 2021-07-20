import os
import json

import eventlet
import socketio

from .portable_tank_drive import PortableTankDrive

PORT = 5000
MAX_SPEED_PERCENT = 50

working_dir = os.path.dirname(os.path.abspath(__file__))
tank_drive = PortableTankDrive(PortableTankDrive.OUTPUT_B, PortableTankDrive.OUTPUT_C)

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
    Expects data to be JSON like this:
    {l_speed_percent: <int>, r_speed_percnet: <int>}
    '''
    data = json.loads(data)
    tank_drive.on(data['l_speed_percent'], data['r_speed_percent'])

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', PORT)), app)
