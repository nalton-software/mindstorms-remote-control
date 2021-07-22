class SensorInfo {
    constructor(ultrasonicDist) {
        this.ultrasonicDist = ultrasonicDist;
    }
}

class SensorPanel {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.div = document.createElement('div');
        this.parentElement.appendChild(this.div);

        this.ultrasonicOutput = document.createElement('p');
        this.div.appendChild(this.ultrasonicOutput);
    }

    display(sensorInfo) {
        this.ultrasonicOutput.innerText =
            `Ultrasonic sensor distance: ${sensorInfo.ultrasonicDist}cm`;
    }
}