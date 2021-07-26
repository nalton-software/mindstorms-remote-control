#!/usr/bin/env python3

try:
    from ev3dev2.sensor.lego import ColorSensor
except:
    pass

import random

from .ports import Ports

class PortableColorSensor:
    '''
    A wrapper to ev3dev.sensor.lego.ColorSensor
    If ev3dev is not available or the there is no sensor plugged in 
    then it pretends to read the sensor but does nothing.
    Useful for running the program on computers other than EV3.
    '''
    def __init__(self, port_name: str):
        self.port_name = port_name

        try:
            self.sensor = ColorSensor(self.port_name)
        except:
            if not Ports.simulated:
                print(f"Failed to create ColorSensor on {self.port_name}.")
            self.sensor = None

    def ambient_light(self, value_if_dummy: int = None) -> int:
        if self.sensor is not None:
            return self.sensor.ambient_light_intensity
        else:
            if value_if_dummy is not None:
                return value_if_dummy
            else:
                return random.randint(0, 100)

    def reflected_light(self, value_if_dummy: int = None) -> int:
        if self.sensor is not None:
            return self.sensor.reflected_light_intensity
        else:
            if value_if_dummy is not None:
                return value_if_dummy
            else:
                return random.randint(0, 100)
