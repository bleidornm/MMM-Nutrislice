# MMM-Nutrislice

This module downloads menus from a specific district, school, and daily menu from the Nutrislice.com menu provider and displays it on the screen.

Background information on the app can be found [at this tutorial](https://vees.net/).

Operation depends on the external API located at:

`https://{district}.api.nutrislice.com/menu/api/weeks/school/{school-name}/menu-type/{menu-type}/{year}/{month}/{day}/`

This API does not require a key. Accesses should be kept to a minimum period (day or several days) to reduce loads on the server.
