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
// Also can have duration varied
class VariableInterval {
    constructor(callback, duration) {
        this.callback = callback;
        this.duration = duration;

        this.timeoutCallback();
    }

    timeoutCallback() {
        this.callback(this);
        this.timeout = setTimeout(this.timeoutCallback.bind(this), this.duration)
    }
    
    destroy() {
        clearTimeout(this.timeout);
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
        return listener;
    }

    addSocketListener(event, callback) {
        const listener = new SocketListener(this.socket, event, callback)
        this.toDestroy.push(listener);
        return listener;
    }

    setInterval(callback, duration) {
        const interval = new VariableInterval(callback, duration);
        this.toDestroy.push(interval);
        return interval;
    }

    getElementById(elemId) {
        // Get an element contained in this div by elemId
        // Note that this only works for one level of nesting

        var elem = document.getElementById(elemId);
        var parent = elem ? elem.parentNode : {};
        return (parent.id && parent.id === this.div.id) ? elem : {};
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