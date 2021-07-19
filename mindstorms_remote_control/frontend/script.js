const passwordInput = document.getElementById('passwordInput');
const activatedCheckbox = document.getElementById('activatedCheckbox');
const statusText = document.getElementById('statusText');

const pressedKeys = {};
let socket;

function connect() {
    statusText.textContent = 'Connecting...';

    socket = io.connect('', {
        auth: passwordInput.value,
    });

    socket.on('connect', () => {
        statusText.textContent = 'Connected! Press arrow keys to move it!';

        window.addEventListener('keydown', (event) => {
            const isRepeating = Boolean(pressedKeys[event.keyCode]);
            if (isRepeating) return;
            pressedKeys[event.keyCode] = true;

            if (activatedCheckbox.checked) {
                socket.emit('keydown', event.key);
            }
        });

        window.addEventListener('keyup', (event) => {
            pressedKeys[event.keyCode] = false;
            if (activatedCheckbox.checked) {
                socket.emit('keyup', event.key);
            }
        });
    });

    socket.on('invalid_password', () => {
        statusText.textContent = 'Password is incorrect!';
    });
}
