const controlArea = document.getElementById('controlArea');

const controlModes = {
    'Basic control' : new BasicControlMode(),
    'Mouse control' : new MouseControlMode()
};

const tabMenu = new TabMenu(document.getElementById('tabMenu'), controlModes);

new LoginArea((socket) => {
    controlArea.style.display = 'revert';
    Object.values(controlModes).forEach(controlMode => {
        controlMode.setSocket(socket);
    });
});