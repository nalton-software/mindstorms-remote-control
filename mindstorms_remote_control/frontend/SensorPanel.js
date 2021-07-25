class SensorInfo {
    constructor(ultrasonicDist, ambientLight, reflectedLight, touchSensorPressed) {
        // ultrasonicDist should be in cm
        // ambientLight should be from 0 to 100, with 0 as black
        // reflectedLight should be from 0 to 100, with 0 as black
        // touchSensorPressed should be a boolean

        this.ultrasonicDist = ultrasonicDist;
        this.ambientLight = ambientLight;
        this.reflectedLight = reflectedLight;
        this.touchSensorPressed = touchSensorPressed;
    }
}

class SensorPanel {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.div = document.createElement('div');
        this.parentElement.appendChild(this.div);

        this.output = document.createElement('p');
        this.div.appendChild(this.output);
    }

    display(sensorInfo) {
        this.output.innerText =
`Ultrasonic sensor distance: ${sensorInfo.ultrasonicDist}cm
Ambient light intensity: ${sensorInfo.ambientLight}%
Reflected light intensity: ${sensorInfo.reflectedLight}%
Touch sensor state: ${sensorInfo.touchSensorPressed ? 'Pressed' : 'Released'}
`;
    }
}