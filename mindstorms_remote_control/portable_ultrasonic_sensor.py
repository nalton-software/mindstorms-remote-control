#!/usr/bin/env python3

imported_ev3_libraries = False

try:
    from ev3dev2.sensor.lego import UltrasonicSensor
    imported_ev3_libraries = True
except:
    pass

import random

from .ports import Ports

class PortableUltrasonicSensor:
    '''
    A wrapper to ev3dev.sensor.lego.UltrasonicSensor
    If ev3dev is not available or the there is no sensor plugged in 
    then it pretends to read the sensor but does nothing.
    Useful for running the program on computers other than EV3.
    '''
    def __init__(self, port_name: str):
        self.port_name = port_name

        if imported_ev3_libraries:
            try:
                self.ev3_sensor = UltrasonicSensor(port_name)
            except:
                print(f'Failed to create UltrasonicSensor on {self.port_name}.')
        else:
            self.ev3_sensor = None

    def distance_cm(self, value_if_dummy: int = None) -> int:
        if self.ev3_sensor is not None:
            return self.ev3_sensor.distance_centimeters
        else:
            if value_if_dummy is not None:
                return value_if_dummy
            else:
                return random.randint(0, 100)
