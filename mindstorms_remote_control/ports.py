#!/usr/bin/env python3

imported_ev3_libraries = False
try:
    import ev3dev2.auto as ev3
    imported_ev3_libraries = True
except:
    pass

class Ports():
    simulated = not imported_ev3_libraries
    OUTPUT_A = ev3.OUTPUT_A if imported_ev3_libraries else 'OUTPUT_A'
    OUTPUT_B = ev3.OUTPUT_B if imported_ev3_libraries else 'OUTPUT_B'
    OUTPUT_C = ev3.OUTPUT_C if imported_ev3_libraries else 'OUTPUT_C'
    OUTPUT_D = ev3.OUTPUT_D if imported_ev3_libraries else 'OUTPUT_D'

    INPUT_1 = ev3.INPUT_1 if imported_ev3_libraries else 'INPUT_1'
    INPUT_2 = ev3.INPUT_2 if imported_ev3_libraries else 'INPUT_2'
    INPUT_3 = ev3.INPUT_3 if imported_ev3_libraries else 'INPUT_3'
    INPUT_4 = ev3.INPUT_4 if imported_ev3_libraries else 'INPUT_4'
