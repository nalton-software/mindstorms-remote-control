class SensorInfo {
    constructor(serverData) {        
        // expected fields of serverData:
        // ultrasonic_dist should be a number in cm
        // ambient_light should be a value from 0 to 100, with 0 as black
        // reflected_light should be a value from 0 to 100, with 0 as black
        // touch_sensor_pressed should be a boolean

        this.ultrasonicDist = serverData.ultrasonic_dist;
        this.ambientLight = serverData.ambient_light;
        this.reflectedLight = serverData.reflected_light;
        this.touchSensorPressed = serverData.touch_sensor_pressed;
    }
}

class SensorPanel {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.div = document.createElement('div');
        this.parentElement.appendChild(this.div);
        
        this.pollingRateSliderLabel = document.createElement('label');
        this.div.appendChild(this.pollingRateSliderLabel);
        this.pollingRateSliderLabel.innerText = 'Sensor polling rate: '; 
        // Can't set "for" as polling rate slider has no id 

        this.pollingRateSlider = document.createElement("input");
        this.div.appendChild(this.pollingRateSlider);
        this.pollingRateSlider.type = "range";
        this.pollingRateSlider.min = "10";
        this.pollingRateSlider.max = "5000";
        this.pollingRateSlider.value = "100";
        this.pollingRateSlider.onchange = () => {
            this.pollingRateValue.innerText = `${this.pollingRate} ms`;
        };
        
        this.pollingRateValue = document.createElement("span");
        this.div.appendChild(this.pollingRateValue);

        this.pollingRateSlider.onchange();

        this.output = document.createElement('p');
        this.div.appendChild(this.output);
    }

    get pollingRate() {
        return Number(this.pollingRateSlider.value);
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