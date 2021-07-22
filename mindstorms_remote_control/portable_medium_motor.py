#!/usr/bin/env python3
imported_ev3_libraries = False
try:
    from ev3dev2.motor import MediumMotor, OUTPUT_A, OUTPUT_B, \
        OUTPUT_C, OUTPUT_D, SpeedPercent
    from ev3dev2.sensor import INPUT_1
    from ev3dev2.sensor.lego import TouchSensor
    from ev3dev2.led import Leds
    imported_ev3_libraries = True
except:
    pass

from .ports import Ports

class PortableMediumMotor:
    '''
    A wrapper to ev3dev.motors.MediumMotor
    If ev3dev is not available then it pretends to move the motors but does nothing.
    Useful for running the program on computers other than EV3.
    '''
    def __init__(self, motor_name):
        self.motor_name = motor_name

        if imported_ev3_libraries:
            lookup = {
                Ports.OUTPUT_A : OUTPUT_A,
                Ports.OUTPUT_B : OUTPUT_B,
                Ports.OUTPUT_C : OUTPUT_C,
                Ports.OUTPUT_D : OUTPUT_D,
            }
            self.medium_motor = MediumMotor(lookup[self.motor_name])

    def on(self, speed_percent: int):
        if imported_ev3_libraries:
            self.medium_motor.on(SpeedPercent(speed_percent))
        else:
            print(f'[forever] {self.motor_name}: {speed_percent}')
                
    def on_for_degrees(self, speed_percent: int, degrees: float):
        if imported_ev3_libraries:
            self.medium_motor.on_for_degrees(SpeedPercent(speed_percent), degrees)
        else:
            print(f'[{degrees} degrees] {self.motor_name}: {speed_percent}')
                
    def on_for_rotations(self, speed_percent: int, rotations: float):
        if imported_ev3_libraries:
            self.medium_motor.on_for_rotations(SpeedPercent(speed_percent), rotations)
        else:
            print(f'[{rotations} rotations] {self.motor_name}: {speed_percent}')
                
    def on_for_seconds(self, speed_percent: int, seconds: float):
        if imported_ev3_libraries:
            self.medium_motor.on_for_seconds(SpeedPercent(speed_percent), seconds)
        else:
            print(f'[{seconds} seconds] {self.motor_name}: {speed_percent}')
                
