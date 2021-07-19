const passwordInput = document.getElementById('passwordInput');
const activatedCheckbox = document.getElementById('activatedCheckbox');
var socket = io();

function emitJson(socket, event, object) {
    socket.emit(event, JSON.stringify(object));
}

function tryLogin() {
    socket = io()
}

var pressedKeys = [];

window.addEventListener('keydown', (event) => {
    var isRepeating = !!pressedKeys[event.keyCode];
    if (isRepeating) return;
    pressedKeys[event.keyCode] = true;

    if (activatedCheckbox.checked) {
        emitJson(socket, 'keydown', {key : event.key, password : passwordInput.value});
    }
});

window.addEventListener('keyup', (event) => {
    pressedKeys[event.keyCode] = false;
    if (activatedCheckbox.checked) {
        emitJson(socket, 'keyup', {key : event.key, password : passwordInput.value});
    }
});

socket.on('invalid_password', () => {
    alert('Password is incorrect');
});