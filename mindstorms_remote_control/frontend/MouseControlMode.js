class MouseControlMode extends ControlMode {
    constructor() {
        super('MouseControlMode', 'mouseControls');

        this.activated = false;

        this.maxForwardSpeed = 100;
        this.maxTurnAmount = 50;
    }

    calcTankSteering(speed, turnFactor) {
        // turnFactor is from -1 to 1
        // -1 is full left, 1 is full right
        var lSpeedPercent = speed;
        var rSpeedPercent = speed;
        lSpeedPercent -= turnFactor * this.maxTurnAmount;
        rSpeedPercent += turnFactor * this.maxTurnAmount;

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

        return {l_speed_percent: lSpeedPercent, r_speed_percent: rSpeedPercent};
    }

    onActivated() {
        this.addEventListener(window, 'keypress', event => {
            if (event.key == ' ') {
                this.activated = ! this.activated;
            }
        });
        this.addEventListener(document, 'mousemove', event => {
            if (this.activated) {
                var rect = this.div.getBoundingClientRect();
                var posX = event.x - rect.left;
                var xProportion = posX / this.div.clientWidth * 2 - 1;
                var turnFactor = Math.min(1, Math.max(xProportion, -1));

                var posY = event.y - rect.top;
                var yProportion = posY / this.div.clientHeight * 2 - 1;
                yProportion = Math.min(1, Math.max(yProportion, -1));
                var forwardSpeed = yProportion * this.maxForwardSpeed * -1;

                this.socket.emit('tank_steer', this.calcTankSteering(forwardSpeed, turnFactor));
            }
        });
    }
}