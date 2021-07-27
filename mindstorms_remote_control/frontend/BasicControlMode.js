class BasicControlMode extends ControlMode {
    constructor() {
        super('Basic', 'basicControls');

        this.keysDown = {};

        this.sensorPanel = new SensorPanel(this.div);

        this.activatedCheckbox = this.getElementById('activatedCheckbox');
        this.speedSliders = {
            tankSteer: this.getElementById('tankSteerSlider'),
            mediumMotor: this.getElementById('mediumMotorSlider'),
        };
    }

    calcTankSteering() {
        var lSpeedPercent = 0;
        var rSpeedPercent = 0;

        const tankSteerSpeed = Number(this.speedSliders.tankSteer.value);
        if (this.keysDown.ArrowUp) {
            lSpeedPercent += tankSteerSpeed;
            rSpeedPercent += tankSteerSpeed;
        }
        if (this.keysDown.ArrowDown) {
            lSpeedPercent -= tankSteerSpeed;
            rSpeedPercent -= tankSteerSpeed;
        }
        if (this.keysDown.ArrowLeft) {
            lSpeedPercent -= tankSteerSpeed;
            rSpeedPercent += tankSteerSpeed;
        }
        if (this.keysDown.ArrowRight) {
            lSpeedPercent += tankSteerSpeed;
            rSpeedPercent -= tankSteerSpeed;
        }

        // Cap percentages to max speed
        if (lSpeedPercent > tankSteerSpeed) {
            const multiplier = tankSteerSpeed / lSpeedPercent;
            lSpeedPercent *= multiplier;
            rSpeedPercent *= multiplier;
        } else if (rSpeedPercent > tankSteerSpeed) {
            const multiplier = tankSteerSpeed / rSpeedPercent;
            lSpeedPercent *= multiplier;
            rSpeedPercent *= multiplier;
        }

        return { l_speed_percent: lSpeedPercent, r_speed_percent: rSpeedPercent };
    }

    calcMediumMotorSpeed() {
        var speed = 0;
        if (this.keysDown.ShiftLeft) {
            speed += Number(this.speedSliders.mediumMotor.value);
        }
        if (this.keysDown.ControlLeft) {
            speed -= Number(this.speedSliders.mediumMotor.value);
        }
        return speed;
    }

    onActivated() {
        this.addEventListener(window, 'keydown', (event) => {
            const isPressed = Boolean(this.keysDown[event.code]);
            if (isPressed) return;
            this.keysDown[event.code] = true;

            if (this.activatedCheckbox.checked) {
                this.socket.emit('tank_steer', this.calcTankSteering());
                this.socket.emit('medium_motor_drive', this.calcMediumMotorSpeed());
            }
        });

        this.addEventListener(window, 'keyup', (event) => {
            this.keysDown[event.code] = false;
            if (this.activatedCheckbox.checked) {
                this.socket.emit('tank_steer', this.calcTankSteering());
                this.socket.emit('medium_motor_drive', this.calcMediumMotorSpeed());
            }
        });

        this.setInterval((intervalObj) => {
            if (this.activatedCheckbox.checked) this.socket.emit('get_sensor_data');

            intervalObj.duration = this.sensorPanel.pollingRate;
        }, this.getSensorDataInterval);

        this.addSocketListener('sensor_data', (data) => {
            this.sensorPanel.display(new SensorInfo(data));
        });
    }
}
