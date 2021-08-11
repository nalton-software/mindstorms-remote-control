FROM ev3dev/ev3dev-buster-ev3-generic

WORKDIR /app

RUN sudo apt-get update && sudo apt-get install python3-pip:armel -y

COPY requirements.txt .

RUN sudo pip3 install -r requirements.txt

COPY . .
