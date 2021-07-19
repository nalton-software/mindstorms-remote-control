import eventlet
import socketio
import os

PORT = 80

working_dir = os.path.dirname(os.path.abspath(__file__))

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
    '/': f'{working_dir}/frontend/'
})

@sio.event
def connect(sid, environ):
    print('connect ', sid)

@sio.event
def keypress(sid, data: str):
    print('message ', data)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', PORT)), app)
