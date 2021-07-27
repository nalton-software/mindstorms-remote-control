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
        let lSpeedPercent = speed;
        let rSpeedPercent = speed;
        const turnAmount = Number(this.sliders.turnAmount.value);
        lSpeedPercent -= turnFactor * turnAmount;
        rSpeedPercent += turnFactor * turnAmount;

        // Cap percentages to max speed
        if (lSpeedPercent > 100) {
            const multiplier = 100 / lSpeedPercent;
            lSpeedPercent *= multiplier;
            rSpeedPercent *= multiplier;
        } else if (rSpeedPercent > 100) {
            const multiplier = 100 / rSpeedPercent;
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
                if (!this.activated)
                    this.socket.emit('tank_steer', { l_speed_percent: 0, r_speed_percent: 0 });
            }
        });

        this.addEventListener(document, 'mousemove', (event) => {
            if (this.activated) {
                const rect = this.div.getBoundingClientRect();
                const mouseX = event.x - rect.left;
                const proportionX = (mouseX / this.div.clientWidth) * 2 - 1;
                const turnFactor = Math.min(1, Math.max(proportionX, -1));

                const mouseY = event.y - rect.top;
                let proportionY = (mouseY / this.div.clientHeight) * 2 - 1;
                proportionY = Math.min(1, Math.max(proportionY, -1));
                const maxForwardSpeed = Number(this.sliders.speed.value);
                const forwardSpeed = proportionY * maxForwardSpeed * -1;

                this.socket.emit('tank_steer', this.calcTankSteering(forwardSpeed, turnFactor * -1));
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
