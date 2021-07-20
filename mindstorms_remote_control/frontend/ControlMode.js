class ControlMode {
    EventListener = class {
        // A class similar to a regular event listener but 
        // optimised for easy removal, to allow switching between
        // different program modes.
        constructor(element, eventName, callback) {
            element.addEventListener(eventName, callback);
            this.element = element;
            this.eventName = eventName;
            this.callback = callback;
        }

        destroy() {
            this.element.removeEventListener(this.eventName, this.callback);
        }
    }

    constructor(name, divId) {
        this.name = name;
        this.eventListeners = [];
        this.div = document.getElementById(divId);
    }

    setSocket(socket) {
        this.socket = socket;
    }

    addEventListener(element, eventName, callback) {
        // Create an event listener that is removed when the
        // ControlMode is deactivated
        var listener = new this.EventListener(element, eventName, callback)
        this.eventListeners.push(listener);
    }

    activate() {
        this.div.style.display = 'table';
        this.onActivated();
    }

    onActivated() {
        // Overwrite in superclasses
    }

    deactivate() {
        this.div.style.display = 'none';
        this.onDeactivated();
        this.eventListeners.forEach(l => {
            l.destroy();
        });
    }

    onDeactivated() {
        // Overwrite in superclasses
    }
}