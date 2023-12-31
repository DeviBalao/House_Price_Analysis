// Variable for the charts
var medianBar;
var nationalMedianHouseSize;

// Connecting html overview link and flask api from python
d3.select('#overviewPage').on('click', function () {    
  displayOverview('/api/v1.0/overview', '#overviewdiv');
});

// Function to create and display overview of house price and income bar chart
function displayOverview(endpoint, jsonElement) {
  d3.json(endpoint)
    .then(function (data) {
      
let states = Object.values(data.State);
let medianHousePrice = Object.values(data["Median Home Price"]);
let medianIncome = Object.values(data["Median Household Income"]);
 
let trace_HousePrice = {
  x: states,
  y: medianHousePrice,
  type: 'bar',
  name: 'Median House Price',
  marker: {
    color: "brown",
    opacity: 0.5,
  }
};

let trace_Income = {
  x: states,
  y: medianIncome,
  type: 'bar',
  name: 'Median Income',
  marker: {
    color: "green",
    opacity: 0.5
  }
};

let highestChartData = [trace_HousePrice, trace_Income];

let highestChart_layout = {
  title: '2023 Median House Price and Median Income',
  xaxis: {
    tickangle: -45
  },
  barmode: 'group'
};

Plotly.newPlot('OverviewChart', highestChartData, highestChart_layout);


    });
}

// Event listener for getting state details
d3.select('#get-states').on('click', function () {    
  fetchDataAndDisplay('/api/v1.0/states_details', '#states-json');
});

// Function to fetch and display JSON data from the API endpoints using d3.json
function fetchDataAndDisplay(endpoint, jsonElement) {
    d3.json(endpoint)
      .then(function (data) {
        
        // statesData = data[0];
        // citiesData = data[1];
        // //console.log("States",data[0]);
        // console.log("Cities",citiesData);
        // Clear existing content
        d3.select(jsonElement).html("");             
        
        // Create the dropdown for states
        let stateDrpdwn = d3.select(document.createElement('select'));      
        stateDrpdwn.attr("id", "states-list");

        // Get the number of items
        let scount = Object.keys(data.State).length;
        // Add the states to the dropdown
        for (let cnt =0; cnt < scount; cnt++)
        {
            let state = data.State[cnt]
            stateDrpdwn.append("option").text(state).attr("value",cnt);
        }
        d3.select(jsonElement).node().appendChild(stateDrpdwn.node());
        
        //Create Bar Chart using Chart.js
        createCharts(data);
        
        // Function updateChart is called when the selection in state dropdown is changed
        d3.select("#states-list").on("change", updateCharts);

        // Updates the chart based on the selected State
        function updateCharts()
        {
          let dropdownMenu = d3.select("select");
          // Assign the value of the dropdown menu option to a variable
          let selectedStateIndex = dropdownMenu.property("value");                   
          let selState = data.State[selectedStateIndex]
          let stateMedianIncome = data["Median Household Income"][selectedStateIndex];
          let stateMedianHousePrice = data["Median Home Price"][selectedStateIndex];
          
          // Update the values for the Chart.js based on the selected state
           medianBar.data.labels[1] = selState
           medianBar.data.datasets[0].data[1] = stateMedianIncome;
           medianBar.data.datasets[1].data[1] = stateMedianHousePrice;
           medianBar.update('none');

           //Update Plotly chart
           let stateMedianHouseSize = data["Median Home Size (in square feet)"][selectedStateIndex];
           let newX = [nationalMedianHouseSize,stateMedianHouseSize];
           let newY = ["National",selState,];
           Plotly.restyle("sqftChart", "x", [newX]);
           Plotly.restyle("sqftChart", "y", [newY]);              
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  
 
// Initial creation of the Bar charts
function createCharts(fullData)
{
   //Calculate the National Median of the 3 columns
   let nationalMedianHousePrice = calculateMedian(fullData["Median Home Price"]);   
   let nationalMedianHouseholdIncome = calculateMedian(fullData["Median Household Income"]);
   nationalMedianHouseSize = calculateMedian(fullData["Median Home Size (in square feet)"]);

   // Get the details of the first state for initial values of the Bar Chart
   let selState = fullData.State[0]
   let stateMedianIncome = fullData["Median Household Income"][0];
   let stateMedianHousePrice = fullData["Median Home Price"][0];
   let stateMedianHouseSize = fullData["Median Home Size (in square feet)"][0];
   
// Generate the Bar Chart        
   let barChartCanvas = document.getElementById('barChart');
   let xValues = ["National",selState,];
   let yIncome = [nationalMedianHouseholdIncome, stateMedianIncome];
   let yHousePrice = [nationalMedianHousePrice, stateMedianHousePrice];
   let houseSize = [nationalMedianHouseSize, stateMedianHouseSize];
   medianBar =  new Chart(barChartCanvas, {
       type: 'bar',
       data: {
       labels: xValues,
       datasets: [{
       backgroundColor: "green",
       data: yIncome,
       label: 'Median Income'        
       },
       {
       backgroundColor: "brown",
       data: yHousePrice,
       label: 'Median House Price'
       }]
       },
       options: {
        responsive: true,
        maintainAspectRatio: false,
       scales: { y: { beginAtZero: true } }
       }
   });
   
   // Plotly Chart to show Median House Size
  let sqftChartdata = [{
    type: 'bar',
    x: houseSize,
    y: xValues,
    orientation: 'h',
    marker: {
      color: "lightblue",
      width: 0.3,
      opacity: 0.7
    },
    }];
  let sqftChartLayout = {
    title: "Median House Size (in square feet)",
    autosize: false,
    width: 400,
    height: 400,
  }
  Plotly.newPlot('sqftChart', sqftChartdata,sqftChartLayout);
}

// Calculate Median of the input  
function calculateMedian(dataArray)
{
    if (Object.values(dataArray).length == 50)
    {
        let arrayForMedian = Object.values(dataArray);        
        let sortedArray = sortArray(arrayForMedian);
        nationalMedian = (sortedArray[24] + sortedArray[25])/2;
        return nationalMedian;   
    } 
    else
    {
        console.log("Check the array size to calculate Median.")
    }
}

// Sorts the array in ascending order     
function sortArray(inputArray)
{
  let result = inputArray.sort((num1,num2)=> num1-num2);  
  return result;
}