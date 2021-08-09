# mindstorms-remote-control

Remote controlling an EV3 robot through a web app.

## Usage instructions

(from the directory containing `README.md`)

```sh
sudo -H pip3 install -r requirements.txt
python3 -m mindstorms_remote_control
```

Use emulator:

```sh
sudo -H pip3 install ev3dev2simulator
ev3dev2simulator -t custom_robot_world.yaml
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

The robot will be running a web server or sending bluetooth commands to a web server hosted on a computer that will have a website frontend interface that will keyboard listeners that will send instructions to the web server then to the robot if they’re pressed.

The robot will also be able to send data back (either constantly or on demand) such as ultrasonic sensor distance and color sensor brightness.

## Success criteria

Pressing the arrow keys or WASD should move the robot in the correct direction. The commands should also have less than 50ms latency.

The sensors should send back their correct data as well.

## Test Method

We will test this by using all of the keyboard commands and checking that they perform as expected.

We might also challenge someone to a race or a sumo contest and tests if it can do well.
