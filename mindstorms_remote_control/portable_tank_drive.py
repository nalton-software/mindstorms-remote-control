#!/usr/bin/env python3

try:
    from ev3dev2.motor import SpeedPercent, MoveTank
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

        try:
            self.motor = MoveTank(left_motor_name, right_motor_name)
        except:
            if not Ports.simulated:
                print(f"Failed to create TankDrive on {left_motor_name} and {right_motor_name}.")
            self.motor = None

    def on(self, l_speed_percent: int, r_speed_percent: int):
        if self.motor is not None:
            self.motor.on(SpeedPercent(l_speed_percent),
                SpeedPercent(r_speed_percent))
        else:
            print(f'[forever] {self.left_motor_name}: {l_speed_percent}, '+
                f'{self.right_motor_name}: {r_speed_percent}')
                
    def on_for_degrees(self, l_speed_percent: int, r_speed_percent: int,
        degrees: float):

        if self.motor is not None:
            self.motor.on_for_rotations(SpeedPercent(l_speed_percent),
                SpeedPercent(r_speed_percent), degrees)
        else:
            print(f'[{degrees} degrees] {self.left_motor_name}: {l_speed_percent}, '+
                f'{self.right_motor_name}: {r_speed_percent}')
    
    def on_for_rotations(self, l_speed_percent: int, r_speed_percent: int,
        rotations: float):

        if self.motor is not None:
            self.motor.on_for_rotations(SpeedPercent(l_speed_percent),
                SpeedPercent(r_speed_percent), rotations)
        else:
            print(f'[{rotations} rotations] {self.left_motor_name}: {l_speed_percent}, '+
                f'{self.right_motor_name}: {r_speed_percent}')
    
    def on_for_seconds(self, l_speed_percent: int, r_speed_percent: int,
        seconds: float):

        if self.motor is not None:
            self.motor.on_for_rotations(SpeedPercent(l_speed_percent),
                SpeedPercent(r_speed_percent), seconds)
        else:
            print(f'[{seconds} seconds] {self.left_motor_name}: {l_speed_percent}, '+
                f'{self.right_motor_name}: {r_speed_percent}')
