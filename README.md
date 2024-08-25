# MMM-Nutrislice

This module downloads menus from a specific district, school, and daily menu from the Nutrislice.com menu provider and displays it on the screen.

Background information on the app can be found [at this tutorial](https://vees.net/).

Operation depends on the external API located at:

`https://{district}.api.nutrislice.com/menu/api/weeks/school/{school-name}/menu-type/{menu-type}/{year}/{month}/{day}/`

This API does not require a key. Accesses should be kept to a minimum period (day or several days) to reduce loads on the server.

To use, add a block to `config.js` that looks like the following:

```javascript
{
    module: "MMM-Nutrislice",
    position: "top_left",
    config: {
        district: "soudertonsd", // Your district here
        schoolName: "salford-hills-elementary-school", // Your school name here
        updateInterval: 3600000 // 1 hour
    }
}

```

## Features to add

- Move from a day with both breakfast and lunch in one line to split breakfast and lunch apart into two bullets under "Today's Menu"
- Limit out to or highlight entries with `"food_category": "entree"` 
- Configure multiple days or next n days of entry