const socket = io('');

window.addEventListener('keydown', (event) => {
    console.log(event.key)
    socket.emit('keypress', event.key);
});