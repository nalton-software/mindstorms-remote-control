class BasicControlMode extends ControlMode {
    constructor() {
        super('Basic', 'basicControls');

        this.keysDown = {};
        this.maxSpeeds = {
            tankSteer: 50,
            mediumMotor: 10
        };
        this.getSensorDataInterval = 250;

        this.sensorPanel = new SensorPanel(this.div);

        this.activatedCheckbox = document.getElementById('basicControlActivatedCheckbox');;
    }

    calcTankSteering() {
        var lSpeedPercent = 0;
        var rSpeedPercent = 0;

        if (this.keysDown.ArrowUp) {
            lSpeedPercent += this.maxSpeeds.tankSteer;
            rSpeedPercent += this.maxSpeeds.tankSteer;
        }
        if (this.keysDown.ArrowDown) {
            lSpeedPercent -= this.maxSpeeds.tankSteer;
            rSpeedPercent -= this.maxSpeeds.tankSteer;
        }
        if (this.keysDown.ArrowLeft) {
            lSpeedPercent -= this.maxSpeeds.tankSteer;
            rSpeedPercent += this.maxSpeeds.tankSteer;
        }
        if (this.keysDown.ArrowRight) {
            lSpeedPercent += this.maxSpeeds.tankSteer;
            rSpeedPercent -= this.maxSpeeds.tankSteer;
        }

        // Cap percentages to max speed
        if (lSpeedPercent > this.maxSpeeds.tankSteer) {
            var multiplier = this.maxSpeeds.tankSteer / lSpeedPercent;
            lSpeedPercent *= multiplier;
            rSpeedPercent *= multiplier;
        } else if (rSpeedPercent > this.maxSpeeds.tankSteer) {
            var multiplier = this.maxSpeeds.tankSteer / rSpeedPercent;
            lSpeedPercent *= multiplier;
            rSpeedPercent *= multiplier;
        }

        return {l_speed_percent: lSpeedPercent, r_speed_percent: rSpeedPercent};
    }

    calcMediumMotorSpeed() {
        var speed = 0;
        if (this.keysDown.ShiftLeft) {
            speed += this.maxSpeeds.mediumMotor;
        }
        if (this.keysDown.ControlLeft) {
            speed -= this.maxSpeeds.mediumMotor;
        }
        return speed;
    }

    onActivated() {
        this.addEventListener(window, 'keydown', (event) => {
            const isRepeating = Boolean(this.keysDown[event.code]);
            if (isRepeating) return;
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

        this.setInterval(() => {
            this.socket.emit('get_sensor_data', {});
        }, this.getSensorDataInterval);

        this.addSocketListener('sensor_data', data => {
            this.sensorPanel.display(new SensorInfo(
                data.ultrasonic_dist,
                data.ambient_light,
                data.reflected_light,
                data.touch_sensor_pressed));
        });
    }
}