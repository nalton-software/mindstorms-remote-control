const activatedCheckbox = document.getElementById('activatedCheckbox');
const controlArea = document.getElementById('controlArea');

const keysDown = {};
var maxSpeeds = {
    tankSteer: 50,
    mediumMotor: 10
}

function calcTankSteering() {
    var lSpeedPercent = 0;
    var rSpeedPercent = 0;

    if (keysDown.ArrowUp) {
        lSpeedPercent += maxSpeeds.tankSteer;
        rSpeedPercent += maxSpeeds.tankSteer;
    }
    if (keysDown.ArrowDown) {
        lSpeedPercent -= maxSpeeds.tankSteer;
        rSpeedPercent -= maxSpeeds.tankSteer;
    }
    if (keysDown.ArrowLeft) {
        lSpeedPercent -= maxSpeeds.tankSteer;
        rSpeedPercent += maxSpeeds.tankSteer;
    }
    if (keysDown.ArrowRight) {
        lSpeedPercent += maxSpeeds.tankSteer;
        rSpeedPercent -= maxSpeeds.tankSteer;
    }

    // Cap percentages to max speed
    if (lSpeedPercent > maxSpeeds.tankSteer) {
        var multiplier = maxSpeeds.tankSteer / lSpeedPercent;
        lSpeedPercent *= multiplier;
        rSpeedPercent *= multiplier;
    } else if (rSpeedPercent > maxSpeeds.tankSteer) {
        var multiplier = maxSpeeds.tankSteer / rSpeedPercent;
        lSpeedPercent *= multiplier;
        rSpeedPercent *= multiplier;
    }

    return {l_speed_percent: lSpeedPercent, r_speed_percent: rSpeedPercent};
}

function calcMediumMotor() {
    var speed = 0;
    if (keysDown.ShiftLeft) {
        speed += maxSpeeds.mediumMotor;
    }
    if (keysDown.CtrlLeft) {
        speed -= maxSpeeds.mediumMotor;
    }
    return speed;
}

new LoginArea((socket) => {
    document.addEventListener('keydown', (event) => {
        const isRepeating = Boolean(keysDown[event.code]);
        if (isRepeating) return;
        keysDown[event.code] = true;

        if (activatedCheckbox.checked) {
            socket.emit('tank_steer', calcTankSteering());
            socket.emit('medium_motor_drive', calcMediumMotor());
        }
    });

    document.addEventListener('keyup', (event) => {
        keysDown[event.code] = false;
        if (activatedCheckbox.checked) {
            socket.emit('tank_steer', calcTankSteering());
            socket.emit('medium_motor_drive', calcMediumMotor());
        }
    });
});