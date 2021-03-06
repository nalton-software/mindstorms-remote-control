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

## Program structure

The program is segregated into two main parts; the frontend website and the backend server. The backend server sets up a socketio server serving the frontend as static html in the `frontend/` folder and waits for the frontend to connect with the socketio server. The frontend will connect with a password (for security) and then will be able to send motor moves commands to the server with minimal latency. Note that the backend only handles motor moves command from the frontend which will do all the motor move calculating from the key presses or mouse moves (control modes). The frontend will also poll the server for sensor data and the server will send it back. 
