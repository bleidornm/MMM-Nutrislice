Module.register("MMM-Nutrislice", {
    // Default module config.
    defaults: {
        breakfastUrl: "https://soudertonsd.api.nutrislice.com/menu/api/weeks/school/salford-hills-elementary-school/menu-type/breakfast/2024/08/27/",
        lunchUrl: "https://soudertonsd.api.nutrislice.com/menu/api/weeks/school/salford-hills-elementary-school/menu-type/lunch/2024/08/27/",
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
        this.sendSocketNotification("GET_MENU_DATA", {
            breakfastUrl: this.config.breakfastUrl,
            lunchUrl: this.config.lunchUrl
        });
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
