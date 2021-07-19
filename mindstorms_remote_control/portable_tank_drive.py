#!/usr/bin/env python3
imported_ev3_libraries = False
try:
    from ev3dev2.motor import LargeMotor, OUTPUT_A, OUTPUT_B, \
        OUTPUT_C, OUTPUT_D, SpeedPercent, MoveTank
    from ev3dev2.sensor import INPUT_1
    from ev3dev2.sensor.lego import TouchSensor
    from ev3dev2.led import Leds
    imported_ev3_libraries = True
except:
    pass

class PortableTankDrive:
    '''
    A wrapper to ev3dev.motors.MoveTank.
    If ev3dev is not available then it pretends to move the motors but does nothing.
    Useful for running the program on computers other than EV3.
    '''

    OUTPUT_A = 'OUTPUT_A'
    OUTPUT_B = 'OUTPUT_B'
    OUTPUT_C = 'OUTPUT_C'
    OUTPUT_D = 'OUTPUT_D'

    def __init__(self, left_motor_name: str, right_motor_name: str):
        self.left_motor_name = left_motor_name
        self.right_motor_name = right_motor_name

        if imported_ev3_libraries:
            lookup = {
                self.OUTPUT_A : OUTPUT_A,
                self.OUTPUT_B : OUTPUT_B,
                self.OUTPUT_C : OUTPUT_C,
                self.OUTPUT_D : OUTPUT_D,
            }
            self.tank_drive = MoveTank(lookup[self.left_motor_name],
                lookup[self.right_motor_name])
    def on(self, l_speed_percent: int, r_speed_percent: int):

        if imported_ev3_libraries:
            self.tank_drive.on(SpeedPercent(l_speed_percent),
                SpeedPercent(r_speed_percent))
        else:
            print(f'[forever] {self.left_motor_name}: {l_speed_percent}, '+
                f'{self.right_motor_name}: {r_speed_percent}')
                
    def on_for_degrees(self, l_speed_percent: int, r_speed_percent: int,
        degrees: float):

        if imported_ev3_libraries:
            self.tank_drive.on_for_rotations(SpeedPercent(l_speed_percent),
                SpeedPercent(r_speed_percent), degrees)
        else:
            print(f'[{degrees} degrees] {self.left_motor_name}: {l_speed_percent}, '+
                f'{self.right_motor_name}: {r_speed_percent}')
    
    def on_for_rotations(self, l_speed_percent: int, r_speed_percent: int,
        rotations: float):

        if imported_ev3_libraries:
            self.tank_drive.on_for_rotations(SpeedPercent(l_speed_percent),
                SpeedPercent(r_speed_percent), rotations)
        else:
            print(f'[{rotations} rotations] {self.left_motor_name}: {l_speed_percent}, '+
                f'{self.right_motor_name}: {r_speed_percent}')
    
    def on_for_seconds(self, l_speed_percent: int, r_speed_percent: int,
        seconds: float):

        if imported_ev3_libraries:
            self.tank_drive.on_for_rotations(SpeedPercent(l_speed_percent),
                SpeedPercent(r_speed_percent), seconds)
        else:
            print(f'[{seconds} seconds] {self.left_motor_name}: {l_speed_percent}, '+
                f'{self.right_motor_name}: {r_speed_percent}')