class LoginArea {
    constructor(onLoginFunc) {
        this.statusText = document.getElementById('statusText');
        this.loginButton = document.getElementById('loginButton');
        this.loginButton.onclick = () => this.login();
        this.onLoginFunc = onLoginFunc;
    }

    login() {
        this.statusText.textContent = 'Connecting...';

        this.socket = io.connect('');

        this.socket.on('connect', () => {
            this.statusText.textContent = 'Logged in';
            this.onLoginFunc(this.socket);
        });

        this.socket.on('disconnect', () => {
            this.statusText.textContent = 'Password is incorrect!';
        });

        this.socket.on('connect_failed', () => {
            this.statusText.textContent = 'Failed to connect to server!';
        });
    }
}