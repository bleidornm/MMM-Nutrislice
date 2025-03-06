const NodeHelper = require("node_helper");
const https = require("https");

module.exports = NodeHelper.create({
    start: function() {
        console.log("MMM-Nutrislice helper started...");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_MENU_DATA") {
            this.getMenuData(payload.breakfastUrl, payload.lunchUrl);
        }
    },

    getMenuData: function(breakfastUrl, lunchUrl) {
        const self = this;

        this.fetchData(breakfastUrl, (breakfastData) => {
            this.fetchData(lunchUrl, (lunchData) => {
                const combinedMenus = self.combineMenus(breakfastData, lunchData);
                self.sendSocketNotification("MENU_DATA", combinedMenus);
            });
        });
    },

    fetchData: function(url, callback) {
        https.get(url, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Parse and send callback.
            resp.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    callback(parsedData);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            });

        }).on("error", (err) => {
            console.error("Error fetching data:", err);
        });
    },

    combineMenus: function(breakfastData, lunchData) {
        const combinedMenus = [];

        const breakfastItems = this.parseMenuItems(breakfastData);
        const lunchItems = this.parseMenuItems(lunchData);

        const allDates = Array.from(new Set([...Object.keys(breakfastItems), ...Object.keys(lunchItems)]));

        allDates.forEach(date => {
            const breakfast = breakfastItems[date] ? breakfastItems[date].map((item, index) => {
                return index === 0 ? item : `<span style="font-size: smaller;">${item}</span>`;
            }).join(", ") : "None";

            const lunch = lunchItems[date] ? lunchItems[date].join(", ") : "None";

            const combinedMenuText = `<strong>Breakfast</strong>: ${breakfast}<br><strong>Lunch</strong>: ${lunch}`;

            combinedMenus.push({
                date: date,
                combinedMenu: combinedMenuText
            });
        });

        return combinedMenus;
    },

    parseMenuItems: function(menuData) {
        const parsedItems = {};

        menuData.days.forEach(day => {
            const date = day.date;
            const items = day.menu_items
                .filter(item => item.food?.food_category === "entree")
                .map(item => item.food?.name)
                .filter(Boolean); // Remove "falsy" values
            parsedItems[date] = items;
        });

        return parsedItems;
    }
});
