import eventlet
import socketio

PORT = 80

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'frontend/index.html'},
    '/script.js': {'content_type': 'application/javascript', 'filename': 'frontend/script.js'},
    '/style.css': {'content_type': 'text/css', 'filename': 'frontend/style.css'},
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