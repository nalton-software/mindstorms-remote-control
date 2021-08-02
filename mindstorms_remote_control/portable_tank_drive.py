#!/usr/bin/env python3

imported_ev3_libraries = False

try:
    from ev3dev2.motor import SpeedPercent, MoveTank
    imported_ev3_libraries = False
except:
    pass

from .ports import Ports

class PortableTankDrive:
    '''
    A wrapper to ev3dev.motors.MoveTank.
    If ev3dev is not available or the there is no motor plugged in 
    then it pretends to move the motors but does nothing.
    Useful for running the program on computers other than EV3.
    '''

    def __init__(self, left_motor_name: str, right_motor_name: str):
        self.left_motor_name = left_motor_name
        self.right_motor_name = right_motor_name

        if imported_ev3_libraries:
            try:
                self.ev3_motor = MoveTank(left_motor_name, right_motor_name)
            except:
                print('Failed to create TankDrive on ' + 
                    '{} and {}.'.format(left_motor_name, right_motor_name))
        else:
            self.ev3_motor = None

    def on(self, l_speed_percent: int, r_speed_percent: int):
        if self.ev3_motor is not None:
            self.ev3_motor.on(SpeedPercent(l_speed_percent),
                SpeedPercent(r_speed_percent))
        else:
            print('[forever] {}: {}, '.format(self.left_motor_name, l_speed_percent)+
                '{}: {}'.format(self.right_motor_name, r_speed_percent))
                
    def on_for_degrees(self, l_speed_percent: int, r_speed_percent: int,
        degrees: float):

        if self.ev3_motor is not None:
            self.ev3_motor.on_for_rotations(SpeedPercent(l_speed_percent),
                SpeedPercent(r_speed_percent), degrees)
        else:
            print('[{} degrees] {}: {}, '.format(degrees, self.left_motor_name, l_speed_percent)+
                '{}: {}'.format(self.right_motor_name, r_speed_percent))
    
    def on_for_rotations(self, l_speed_percent: int, r_speed_percent: int,
        rotations: float):

        if self.ev3_motor is not None:
            self.ev3_motor.on_for_rotations(SpeedPercent(l_speed_percent),
                SpeedPercent(r_speed_percent), rotations)
        else:
            print('[{} rotations] {}: {}, '.format(rotations, self.left_motor_name, l_speed_percent)+
                '{}: {}'.format(self.right_motor_name, r_speed_percent))
    
    def on_for_seconds(self, l_speed_percent: int, r_speed_percent: int,
        seconds: float):

        if self.ev3_motor is not None:
            self.ev3_motor.on_for_rotations(SpeedPercent(l_speed_percent),
                SpeedPercent(r_speed_percent), seconds)
        else:
            print('[{} seconds] {}: {}, '.format(seconds, self.left_motor_name, l_speed_percent)+
                '{}: {}'.format(self.right_motor_name, r_speed_percent))
