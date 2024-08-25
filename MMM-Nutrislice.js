Module.register("MMM-Nutrislice", {
    // Default module config.
    defaults: {
        district: "soudertonsd",
        schoolName: "salford-hills-elementary-school",
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

    getMenuData: function() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const breakfastUrl = this.buildUrl("breakfast", year, month, day);
        const lunchUrl = this.buildUrl("lunch", year, month, day);

        this.sendSocketNotification("GET_MENU_DATA", {
            breakfastUrl: breakfastUrl,
            lunchUrl: lunchUrl
        });
    },

    buildUrl: function(menuType, year, month, day) {
        const district = this.config.district;
        const schoolName = this.config.schoolName;

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

        if (!this.menuData) {
            wrapper.innerHTML = "Loading menu data...";
            return wrapper;
        }

        this.menuData.forEach((menu) => {
            const dateElement = document.createElement("div");
            dateElement.className = "menu-date";
            dateElement.innerHTML = `<strong>${menu.date}</strong>: ${menu.combinedMenu}`;
            wrapper.appendChild(dateElement);
        });

        return wrapper;
    }
});
