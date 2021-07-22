class LoginArea {
    constructor(onLoginFunc) {
        this.passwordInput = document.getElementById('passwordInput');
        this.passwordInput.onkeypress = (event) => {
            if (event.code == "Enter") this.login()
        }

        this.statusText = document.getElementById('statusText');
        this.loginButton = document.getElementById('loginButton');
        this.loginButton.onclick = () => this.login();
        this.onLoginFunc = onLoginFunc;
    }

    login() {
        this.statusText.textContent = 'Connecting...';

        this.socket = io.connect('', {
            auth: this.passwordInput.value,
        });

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