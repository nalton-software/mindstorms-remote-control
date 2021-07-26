#!/usr/bin/env python3

try:
    from ev3dev2.motor import MediumMotor, SpeedPercent
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
        self.motor_name = motor_name

        try:
            self.motor = MediumMotor(self.motor_name)
        except:
            if not Ports.simulated:
                print(f"Failed to create MediumMotor on {self.motor_name}.")
            self.motor = None

    def on(self, speed_percent: int):
        if self.motor is not None:
            self.motor.on(SpeedPercent(speed_percent))
        else:
            print(f'[forever] {self.motor_name}: {speed_percent}')
                
    def on_for_degrees(self, speed_percent: int, degrees: float):
        if self.motor is not None:
            self.motor.on_for_degrees(SpeedPercent(speed_percent), degrees)
        else:
            print(f'[{degrees} degrees] {self.motor_name}: {speed_percent}')
                
    def on_for_rotations(self, speed_percent: int, rotations: float):
        if self.motor is not None:
            self.motor.on_for_rotations(SpeedPercent(speed_percent), rotations)
        else:
            print(f'[{rotations} rotations] {self.motor_name}: {speed_percent}')
                
    def on_for_seconds(self, speed_percent: int, seconds: float):
        if self.motor is not None:
            self.motor.on_for_seconds(SpeedPercent(speed_percent), seconds)
        else:
            print(f'[{seconds} seconds] {self.motor_name}: {speed_percent}')
                
