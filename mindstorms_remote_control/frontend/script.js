const loginDiv = document.getElementById('loginDiv');
const controlDiv = document.getElementById('controlDiv');

const passwordInput = document.getElementById('passwordInput');
const activatedCheckbox = document.getElementById('activatedCheckbox');
const statusText = document.getElementById('statusText');

controlDiv.style.display = 'none';
let socket;

function connect() {
    statusText.textContent = 'Connecting...';

    socket = io.connect('', {
        auth: passwordInput.value,
    });

    socket.on('connect', () => {
        loginDiv.style.display = 'none';
        controlDiv.style.display = 'block';
        main();
    });

    socket.on('invalid_password', () => {
        statusText.textContent = 'Password is incorrect!';
    });
}

function main() {
    const keysDown = {};
    var maxSpeedPercent = 50;

    function calcMotorSpeeds() {
        var lSpeedPercent = 0;
        var rSpeedPercent = 0;

        if (keysDown.ArrowUp) {
            lSpeedPercent += maxSpeedPercent;
            rSpeedPercent += maxSpeedPercent;
        }
        if (keysDown.ArrowDown) {
            lSpeedPercent -= maxSpeedPercent;
            rSpeedPercent -= maxSpeedPercent;
        }
        if (keysDown.ArrowLeft) {
            lSpeedPercent -= maxSpeedPercent;
            rSpeedPercent += maxSpeedPercent;
        }
        if (keysDown.ArrowRight) {
            lSpeedPercent += maxSpeedPercent;
            rSpeedPercent -= maxSpeedPercent;
        }

        // Cap percentages to max speed
        if (lSpeedPercent > maxSpeedPercent) {
            var multiplier = maxSpeedPercent / lSpeedPercent;
            lSpeedPercent *= multiplier;
            rSpeedPercent *= multiplier;
        }
        else if (rSpeedPercent > maxSpeedPercent) {
            var multiplier = maxSpeedPercent / rSpeedPercent;
            lSpeedPercent *= multiplier;
            rSpeedPercent *= multiplier;
        }

        return {l_speed_percent: lSpeedPercent, r_speed_percent: rSpeedPercent};
    }

    window.addEventListener('keydown', (event) => {
        const isRepeating = Boolean(keysDown[event.code]);
        if (isRepeating) return;
        keysDown[event.code] = true;

        if (activatedCheckbox.checked) {
            socket.emit('tank_steer', calcMotorSpeeds());
        }
    });

    window.addEventListener('keyup', (event) => {
        keysDown[event.code] = false;
        if (activatedCheckbox.checked) {
            socket.emit('tank_steer', calcMotorSpeeds());
        }
    });
}