# House_Price_Analysis
Create a dashboard showing median house price details for each state.

### Analysis of Median House Price data across the 50 states in USA:

Input data is available in Resources\data\house_price_data.xlsx

- load_data.ipynb - A sqlite database named "housing.sqlite" is created and the input data from excel file is loaded into "house_data" table in the sqlite database.

- app.py is executed to create the dashboard showing the house price details visualiasations. Reading the data from sqlite database and sending it to Flask API are handled in this python file.

- index.html - This html file is used to display the dashboard with different bar charts. It includes references to d3.js, Plotly.js, chart.js along with the reference to static.css file and script.js file.

- styles.css has few stying for the charts.

- script.js - This JavaScript file has the code for processing the data and generating the following 3 charts for the dashboard:

Data source : Rocket Homes [https://www.rockethomes.com/blog/housing-market/median-home-price-by-state]