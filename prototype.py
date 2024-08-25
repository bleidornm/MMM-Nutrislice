import requests
import json

# URLs for breakfast and lunch menus
breakfast_url = "https://soudertonsd.api.nutrislice.com/menu/api/weeks/school/salford-hills-elementary-school/menu-type/breakfast/2024/08/27/"
lunch_url = "https://soudertonsd.api.nutrislice.com/menu/api/weeks/school/salford-hills-elementary-school/menu-type/lunch/2024/08/27/"

# Function to download menu data from a given URL
def download_menu(url):
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to download data from {url}")
        return None

# Function to parse menu items
def parse_menu_items(menu_data):
    parsed_items = {}
    
    for day in menu_data.get("days", []):
        date = day.get("date")
        items = []
        
        for item in day.get("menu_items", []):
            food = item.get("food")
            if food:
                food_name = food.get("name")
                if food_name:
                    items.append(food_name)
        
        parsed_items[date] = items
    
    return parsed_items

# Function to combine breakfast and lunch menus
def combine_menus(breakfast_data, lunch_data):
    combined_menus = []
    breakfast_items = parse_menu_items(breakfast_data)
    lunch_items = parse_menu_items(lunch_data)
    
    # Combine menus by date
    all_dates = sorted(set(breakfast_items.keys()).union(lunch_items.keys()))
    
    for date in all_dates:
        breakfast = ', '.join(breakfast_items.get(date, [])) if breakfast_items.get(date) else 'None'
        lunch = ', '.join(lunch_items.get(date, [])) if lunch_items.get(date) else 'None'
        
        combined_menu = f"**Breakfast**: {breakfast}, **Lunch**: {lunch}"
        combined_menus.append(f"- **{date}**: {combined_menu}")
    
    return combined_menus


# Download breakfast and lunch menus
breakfast_data = download_menu(breakfast_url)
lunch_data = download_menu(lunch_url)

# Combine the menus if both were successfully downloaded
if breakfast_data and lunch_data:
    combined_menus = combine_menus(breakfast_data, lunch_data)
    
    # Display the combined menus
    for menu in combined_menus:
        print(menu)
else:
    print("Failed to download or process the menu data.")
