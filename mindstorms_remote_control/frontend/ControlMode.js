// A class similar to a regular event listener but 
// optimised for easy removal, to allow switching between
// different program modes.
class EventListener {
    constructor(element, eventName, callback) {
        this.element = element;
        this.eventName = eventName;
        this.callback = callback;
        element.addEventListener(eventName, callback);
    }

    destroy() {
        this.element.removeEventListener(this.eventName, this.callback);
    }
}

// The same as EventListener but for sockets
class SocketListener {
    constructor(socket, event, callback) {
        this.socket = socket;
        this.event = event;
        this.callback = callback;
        socket.on(event, callback);
    }

    destroy() {
        this.socket.off(this.event, this.callback);
    }
}

// Same as EventListener but the equivalent of setInterval
class Interval {
    constructor(callback, interval) {
        this.interval = setInterval(callback, interval);
    }

    destroy() {
        clearInterval(this.interval);
    }
}


class ControlMode {
    constructor(name, divId) {
        this.name = name;
        this.toDestroy = [];
        this.div = document.getElementById(divId);
    }

    setSocket(socket) {
        this.socket = socket;
    }

    addEventListener(element, eventName, callback) {
        // Create an event listener that is removed when the
        // ControlMode is deactivated
        const listener = new EventListener(element, eventName, callback)
        this.toDestroy.push(listener);
    }

    addSocketListener(event, callback) {
        const listener = new SocketListener(this.socket, event, callback)
        this.toDestroy.push(listener);
    }

    setInterval(callback, interval) {
        const intervalObj = new Interval(callback, interval);
        this.toDestroy.push(intervalObj);
    }

    activate() {
        this.div.style.display = 'table';
        this.onActivated();
    }

    onActivated() {
        // Overwrite in child classes
    }

    deactivate() {
        this.div.style.display = 'none';
        this.onDeactivated();
        this.toDestroy.forEach(l => {
            l.destroy();
        });
    }

    onDeactivated() {
        // Overwrite in child classes
    }
}