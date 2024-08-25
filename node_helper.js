const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
    start: function() {
        console.log("MMM-Nutrislice helper started...");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_MENU_DATA") {
            this.getMenuData(payload.breakfastUrl, payload.lunchUrl);
        }
    },

    async getMenuData(breakfastUrl, lunchUrl) {
        try {
            const breakfastResponse = await fetch(breakfastUrl);
            const lunchResponse = await fetch(lunchUrl);

            const breakfastData = await breakfastResponse.json();
            const lunchData = await lunchResponse.json();

            const combinedMenus = this.combineMenus(breakfastData, lunchData);

            this.sendSocketNotification("MENU_DATA", combinedMenus);
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    },

    combineMenus(breakfastData, lunchData) {
        const combinedMenus = [];

        const breakfastItems = this.parseMenuItems(breakfastData);
        const lunchItems = this.parseMenuItems(lunchData);

        const allDates = Array.from(new Set([...Object.keys(breakfastItems), ...Object.keys(lunchItems)]));

        allDates.forEach(date => {
            const breakfast = breakfastItems[date] ? breakfastItems[date].join(", ") : "None";
            const lunch = lunchItems[date] ? lunchItems[date].join(", ") : "None";

            combinedMenus.push({
                date: date,
                combinedMenu: `Breakfast: ${breakfast}, Lunch: ${lunch}`
            });
        });

        return combinedMenus;
    },

    parseMenuItems(menuData) {
        const parsedItems = {};

        menuData.days.forEach(day => {
            const date = day.date;
            const items = day.menu_items.map(item => item.food?.name).filter(Boolean);
            parsedItems[date] = items;
        });

        return parsedItems;
    }
});
