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
    If ev3dev is not available or the there is no sensor plugged in 
    then it pretends to read the sensor but does nothing.
    Useful for running the program without an EV3 or having all the ports plugged in.
    '''
    def __init__(self, port_name: str):
        self.port_name = port_name

        if not Ports.simulated:
            try:
                self.ev3_sensor = TouchSensor(self.port_name)
            except:
                print('Failed to create TouchSensor on {}.'.format(self.port_name))
        else:
            self.ev3_sensor = None

    def is_pressed(self, value_if_dummy: bool = None) -> bool:
        if self.ev3_sensor is not None:
            return bool(self.ev3_sensor.is_pressed)
        else:
            if value_if_dummy is not None:
                return value_if_dummy
            else:
                return bool(random.getrandbits(1))
