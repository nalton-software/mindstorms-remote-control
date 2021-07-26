#!/usr/bin/env python3

try:
    from ev3dev2.sensor.lego import TouchSensor
except:
    pass

import random

from .ports import Ports

class PortableTouchSensor:
    '''
    A wrapper to ev3dev.sensor.lego.TouchSensor
    If ev3dev is not available then it pretends to read the sensor but does nothing.
    Useful for running the program on computers other than EV3.
    '''
    def __init__(self, port_name: str):
        self.port_name = port_name

        try:
            self.sensor = TouchSensor(self.port_name)
        except:
            if not Ports.simulated:
                print(f"Failed to create TouchSensor on {self.port_name}.")
            self.sensor = None

    def is_pressed(self, value_if_dummy: bool = None) -> bool:
        if self.sensor is not None:
            return bool(self.sensor.is_pressed)
        else:
            if value_if_dummy is not None:
                return value_if_dummy
            else:
                return bool(random.getrandbits(1))
