# MMM-Nutrislice

This module downloads menus from a specific district, school, and daily menu from the Nutrislice.com menu provider and displays it on the screen.

Background information on the app can be found [at this tutorial](https://vees.net/).

Operation depends on the external API located at:

`https://{district}.api.nutrislice.com/menu/api/weeks/school/{school-name}/menu-type/{menu-type}/{year}/{month}/{day}/`

This API does not require a key. Accesses should be kept to a minimum period (day or several days) to reduce loads on the server.

To use, add a block to `config.js` that looks like the following:

```json
{
    module: "MMM-Nutrislice",
    position: "top_left", // Choose the position where you want to display the menu
    config: {
        // Optionally override the default URLs and update interval here
        breakfastUrl: "https://soudertonsd.api.nutrislice.com/menu/api/weeks/school/salford-hills-elementary-school/menu-type/breakfast/2024/08/27/",
        lunchUrl: "https://soudertonsd.api.nutrislice.com/menu/api/weeks/school/salford-hills-elementary-school/menu-type/lunch/2024/08/27/",
        updateInterval: 3600000 // 1 hour
    }
}
```