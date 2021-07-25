#!/usr/bin/env python3
imported_ev3_libraries = False
try:
    from ev3dev2.sensor import INPUT_1, INPUT_2, INPUT_3, INPUT_4
    from ev3dev2.sensor.lego import UltrasonicSensor
    imported_ev3_libraries = True
except:
    pass

import random

from .ports import Ports

class PortableUltrasonicSensor:
    '''
    A wrapper to ev3dev.sensor.lego.UltrasonicSensor
    If ev3dev is not available then it pretends to read the sensor but does nothing.
    Useful for running the program on computers other than EV3.
    '''
    def __init__(self, port_name):
        self.port_name = port_name

        if imported_ev3_libraries:
            lookup = {
                Ports.INPUT_1 : INPUT_1,
                Ports.INPUT_2 : INPUT_2,
                Ports.INPUT_3 : INPUT_3,
                Ports.INPUT_4 : INPUT_4,
            }
            self.sensor = UltrasonicSensor(lookup[self.port_name])

    def distance_cm(self, value_if_dummy: int = None) -> int:
        if imported_ev3_libraries:
            return self.sensor.distance_centimetres
        else:
            if value_if_dummy is not None:
                return value_if_dummy
            else:
                return random.randint(0, 100)