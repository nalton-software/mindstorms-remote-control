# mindstorms-remote-control

Remote controlling an EV3 robot through a web app.

## Goal

The robot will be able to be controlled remotely on a website.
 
The robot will be running a web server or sending bluetooth commands to a web server hosted on my computer that will have a website frontend interface that will keyboard listeners that will send instructions to the web server then to the robot if they’re pressed.

OPTIONAL: The robot will be able to send data back (either constantly or on demand) such as ultrasonic sensor distance and color sensor brightness.

## Success criteria

Pressing the arrow keys or WASD should move the robot in the correct direction. The commands should also have less than 50ms latency.

## Test Method

We will test this by using all of the keyboard commands and checking that they perform as expected.
