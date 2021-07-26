class MouseControlMode extends ControlMode {
    constructor() {
        super('MouseControlMode', 'mouseControls');

        this.sensorPanel = new SensorPanel(this.div);

        this.activatedOutput = this.getElementById('activatedOutput');

        this.activated = false;

        this.sliders = {
            speed: this.getElementById('speedSlider'),
            turnAmount: this.getElementById('turnAmountSlider'),
        };
    }

    calcTankSteering(speed, turnFactor) {
        // turnFactor is from -1 to 1
        // -1 is full left, 1 is full right
        var lSpeedPercent = speed;
        var rSpeedPercent = speed;
        lSpeedPercent -= turnFactor * this.sliders.turnAmount.value;
        rSpeedPercent += turnFactor * this.sliders.turnAmount.value;

        // Cap percentages to max speed
        if (lSpeedPercent > 100) {
            var multiplier = 100 / lSpeedPercent;
            lSpeedPercent *= multiplier;
            rSpeedPercent *= multiplier;
        } else if (rSpeedPercent > 100) {
            var multiplier = 100 / rSpeedPercent;
            lSpeedPercent *= multiplier;
            rSpeedPercent *= multiplier;
        }

        return { l_speed_percent: lSpeedPercent, r_speed_percent: rSpeedPercent };
    }

    onActivated() {
        this.addEventListener(window, 'keypress', (event) => {
            if (event.key == ' ') {
                this.activated = !this.activated;
                this.activatedOutput.innerText = this.activated ? 'Activated' : 'Deactivated';
            }
        });

        this.addEventListener(document, 'mousemove', (event) => {
            if (this.activated) {
                // TODO: simulator shows it seems to be reversed?
                var rect = this.div.getBoundingClientRect();
                var posX = event.x - rect.left;
                var xProportion = (posX / this.div.clientWidth) * 2 - 1;
                var turnFactor = Math.min(1, Math.max(xProportion, -1));

                var posY = event.y - rect.top;
                var yProportion = (posY / this.div.clientHeight) * 2 - 1;
                yProportion = Math.min(1, Math.max(yProportion, -1));
                var maxForwardSpeed = this.sliders.speed.value;
                var forwardSpeed = yProportion * maxForwardSpeed * -1;

                this.socket.emit('tank_steer', this.calcTankSteering(forwardSpeed, turnFactor));
            }
        });

        this.setInterval((intervalObj) => {
            if (this.activated) this.socket.emit('get_sensor_data');

            intervalObj.duration = this.sensorPanel.pollingRate;
        }, this.sensorPanel.pollingRate);

        this.addSocketListener('sensor_data', (data) => {
            this.sensorPanel.display(new SensorInfo(data));
        });
    }
}
