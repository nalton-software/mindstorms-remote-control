class TabMenu {
    tabClassName = 'tabMenuButton';

    constructor(parentElement, tabs) {
        // parentElement is HTML element.
        // tabs is dictionary of <tab name> : <TabLike>.
        // TabLike is any object that implements activate() and deactivate().
        // To style use .tabMenuButton

        this.parentElement = parentElement;
        this.tabs = tabs;

        Object.keys(this.tabs).forEach(tabName => {
            var element = document.createElement('button');
            element.textContent = tabName;
            element.onclick = this.onTabClick.bind(this);
            element.classList.add(this.tabClassName);
            element.tabName = tabName;
            this.parentElement.appendChild(element);
        })
    }

    onTabClick(event) {
        // Deactivate all tabs first
        Object.values(this.tabs).forEach(tab => {
            tab.deactivate();
        });

        var clickedButton = (event.target) ? event.target : event.srcElement;
        this.tabs[clickedButton.tabName].activate();
    }
}