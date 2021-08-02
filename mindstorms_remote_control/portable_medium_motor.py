#!/usr/bin/env python3

imported_ev3_libraries = False

try:
    from ev3dev2.motor import MediumMotor, SpeedPercent
    imported_ev3_libraries = True
except:
    pass

from .ports import Ports

class PortableMediumMotor:
    '''
    A wrapper to ev3dev.motors.MediumMotor
    If ev3dev is not available or the there is no motor plugged in 
    then it pretends to move the motors but does nothing.
    Useful for running the program on computers other than EV3.
    '''
    def __init__(self, motor_name: str):
        self.ev3_motor_name = motor_name

        if imported_ev3_libraries:
            try:
                self.ev3_motor = MediumMotor(self.ev3_motor_name)
            except:
                print('Failed to create MediumMotor on port {}'.format(self.ev3_motor_name))
        else:
            self.ev3_motor = None

    def on(self, speed_percent: int):
        if self.ev3_motor is not None:
            self.ev3_motor.on(SpeedPercent(speed_percent))
        else:
            print('[forever] {}: {}'.format(self.ev3_motor_name, speed_percent))
                
    def on_for_degrees(self, speed_percent: int, degrees: float):
        if self.ev3_motor is not None:
            self.ev3_motor.on_for_degrees(SpeedPercent(speed_percent), degrees)
        else:
            print('[{degrees} degrees] {}: {}'.format(self.ev3_motor_name, speed_percent))
                
    def on_for_rotations(self, speed_percent: int, rotations: float):
        if self.ev3_motor is not None:
            self.ev3_motor.on_for_rotations(SpeedPercent(speed_percent), rotations)
        else:
            print('[{rotations} rotations] {}: {}'.format(self.ev3_motor_name, speed_percent))
                
    def on_for_seconds(self, speed_percent: int, seconds: float):
        if self.ev3_motor is not None:
            self.ev3_motor.on_for_seconds(SpeedPercent(speed_percent), seconds)
        else:
            print('[{seconds} seconds] {}: {}'.format(self.ev3_motor_name, speed_percent))
                
