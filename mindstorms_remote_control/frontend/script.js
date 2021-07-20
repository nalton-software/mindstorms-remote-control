const activatedCheckbox = document.getElementById('activatedCheckbox');
const controlArea = document.getElementById('controlArea');

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
    } else if (rSpeedPercent > maxSpeedPercent) {
        var multiplier = maxSpeedPercent / rSpeedPercent;
        lSpeedPercent *= multiplier;
        rSpeedPercent *= multiplier;
    }

    return {l_speed_percent: lSpeedPercent, r_speed_percent: rSpeedPercent};
}

new LoginArea((socket) => {
    document.addEventListener('keydown', (event) => {
        const isRepeating = Boolean(keysDown[event.code]);
        if (isRepeating) return;
        keysDown[event.code] = true;

        if (activatedCheckbox.checked) {
            socket.emit('tank_steer', JSON.stringify(calcMotorSpeeds()));
        }
    });

    document.addEventListener('keyup', (event) => {
        keysDown[event.code] = false;
        if (activatedCheckbox.checked) {
            socket.emit('tank_steer', JSON.stringify(calcMotorSpeeds()));
        }
    });
});