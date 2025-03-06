Module.register("MMM-Nutrislice", {
    // Default module config.
    defaults: {
        breakfastUrl: "",
        lunchUrl: "",
        updateInterval: 3600000, // 1 hour
    },

    start: function() {
        this.menuData = null;
        this.getMenuData();
        setInterval(() => {
            this.getMenuData();
        }, this.config.updateInterval);
    },

    getStyles: function() {
        return ["nutrislice.css"];
    },

    getMenuData: function () {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const breakfastUrl = this.buildApiUrl(this.config.breakfastUrl, year, month, day);
        const lunchUrl = this.buildApiUrl(this.config.lunchUrl, year, month, day);

        this.sendSocketNotification("GET_MENU_DATA", { breakfastUrl, lunchUrl });
    },

    buildApiUrl: function(menuUrl, year, month, day) {
        const urlParts = menuUrl.split('/');
        const district = urlParts[2].split('.')[0];
        const schoolName = urlParts[4];
        const menuType = urlParts[5];

        return `https://${district}.api.nutrislice.com/menu/api/weeks/school/${schoolName}/menu-type/${menuType}/${year}/${month}/${day}/`;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "MENU_DATA") {
            this.menuData = payload;
            this.updateDom();
        }
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "MMM-Nutrislice"; // Add this class to apply the CSS

        const header = document.createElement("header");
        header.className = "module-header";
        header.innerHTML = "Today's School Menu";
        wrapper.appendChild(header);

        if (!this.menuData) {
            const loadingElement = document.createElement("div");
            loadingElement.innerHTML = "Loading menu data...";
            wrapper.appendChild(loadingElement);
            return wrapper;
        }

        const today = new Date().toISOString().split('T')[0];
        const menu = this.menuData.find(menu => menu.date === today);

        if (menu) {
            const dateElement = document.createElement("div");
            dateElement.className = "menu-date";
            dateElement.innerHTML = `${menu.combinedMenu}`;
            wrapper.appendChild(dateElement);
        } else {
            const noMenuElement = document.createElement("div");
            noMenuElement.innerHTML = "No menu available for today.";
            wrapper.appendChild(noMenuElement);
        }

        return wrapper;
    }
});
