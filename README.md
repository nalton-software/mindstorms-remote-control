# mindstorms-remote-control

Remote controlling an EV3 robot through a web app.

## Usage instructions

(from the directory containing `README.md`)

```sh
sudo pip3 install -r requirements.txt # install dependencies
python3 -m mindstorms_remote_control # run program
```

Use the emulator: (Note: Ambient light sensor will read null because the emulator doesn't support that)

```sh
sudo pip3 install ev3dev2simulator
ev3dev2simulator -t custom_robot_world.yaml # run this in seperate terminal
python3 -m mindstorms_remote_control # run program
```

NOTE: The following instructions do not seem to work. Do not follow them, they're only there for reference.

To run it inside an actual ev3, you should build an ev3dev image and flash that instead.

First get docker and brickstrap:

Ubuntu:

```sh
sudo add-apt-repository ppa:ev3dev/tools
sudo apt update
sudo apt install brickstrap docker qemu-user-static
```

Arch Linux (from the AUR):

```sh
yay -S docker brickstrap qemu-user-static
```

Build the docker image then use brickstrap to build the sd card image:

```sh
docker build -t mindstorms-remote-control .
brickstrap create-tar mindstorms-remote-control ./mrc.tar
brickstrap create-image ./mrc.tar ./mindstorms-remote-control.img
```

## Goal

The robot will be able to be controlled remotely on a website.

The robot will be running a web server or sending bluetooth commands to a web server hosted on a computer that will have a website frontend interface that will have keyboard listeners that will send instructions to the web server then to the robot if they're pressed.

The robot will also be able to send data back (either constantly or on demand) such as ultrasonic sensor distance and color sensor brightness.

## Success criteria

Pressing the arrow keys or WASD should move the robot in the correct direction. The commands should also have less than 50ms latency.

The sensors should send back their correct data as well.

## Test Method

We will test this by using all of the keyboard commands and checking that they perform as expected with acceptable latency.

We might also challenge someone to a race or a sumo contest and tests if it can do well.

## Evaluation

(draft)

#### Explain the level of success of your 'Robot Routine' against your Design Success Criteria:

While we never actually got the robot to be remotely controlled, we still did achieve most of the design criteria. In some regards, we surpassed them, especially in the frontend where none of the complexity of multiple control modes and high configurability was not actually required. These features were mostly added due to boredom in the lockdown and inability to test the program on the robot.

#### Describe how could you have improved your robot programme:

The most obvious improvement that could have been made is obviously getting to test the program on real hardware instead of with testing stubs.

#### Evaluate your learning of programming robots below:

There were two main problems we faced in creating our program. The first was that the EV3 did not have a working DNS, meaning that it could not fetch packages or libraries by itself - seriously hampering the installing of pip and required libraries. The second was that the system Python on EV3 was only version 3.5 (despite that releasing about 6 years ago), meaning that a lot of the 3.6+ features in our code (and the libraries) raised syntax errors. Initially, we faced issues with Bluetooth connection. There was also a minor problem in that our web server architecture prevented a it from asynchroniously sending sensor data to the clients every *n* milliseconds.

We solved most of the problems. The Bluetooth issue was fixed by moving from the Linux/ChromeBooks to the desktops in the room. To install packages we first downloaded a zip of pip, uploaded it via ssh to the EV3 and installed it locally from there. To install the required Python libraries, we downloaded the `.whl` files onto a computer, uploaded them using ssh and installed with pip. To fix the issue of sending data to the cleints, we simply made it the client's responsibility to ping the webserver and ask for data to be sent back. This also makes it so that only the clients which request server data get it.

The most major problem, and the one that eventually prevented us from running the program, was the old Python version. Rather than face the daunting task of upgrading the system python (or set up a virtual environment), we decided to downgrade our project. We spent about 15 minutes replacing all of the f-strings from our project. We also tried downgrading the libraries, but unfortunately, many were only introduced in Python 3.6. There was even the bizzare case of a pre-3.6 release of `bidict` using f-strings. Initially, we started manually updating the files in the libraries. This was soon found to be a cumbersome task, so we found a program to replace them automatically, and wrote a shell script to run it on all the files. Unfortunately, about halfway through this process, the Bluetooth connection suddenly dropped out and we were unable to restore it before the end of the lesson.

The next lesson (Monday 9 August), we tried booting the EV3 from a disc image we had created with up-to-date Python and all libraries installed, but unfortunately it kept failing to boot and entered a restricted mode with no networking. We spent the rest of the lesson troubleshooting this had no success.

#### How did you solve the various challenges set for your programming?

One thing that we realised at the start of this task was that programs written in MakeCode had no networking capability, and that we would need to use an alternate system such as `ev3dev`.

At the core of the program, we set up a Python webserver based on `socketio` and `eventlet`. It handles both controlling the robot and serving (static) frontend pages. To prevent unauthorised access to the robot, we added a password which was set at server startup. Initially we were sending raw keypress data to the server, but we soon realised how limiting this could be and changed it so that motor movement instructions were sent to the server.

We faced the difficulty of how to test the webserver and the communication with clients on platforms other than the EV3. This was solved by the creation of a family of portable classes for motors and sensors. They attempt to import `ev3dev`, but will fall back to printing the motor statuses into the terminal if it cannot find `ev3dev`. If the classes do import `ev3dev`, then they act as a wrapper for the `ev3dev` classes. Later we also experimented with `ev3dev2simulator`.