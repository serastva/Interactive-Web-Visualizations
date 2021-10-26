//PART 1 and Bonus in one file
//#################################################################################//

// get metadata using d3.json

function metaData(sample) {
  d3.json("data/samples.json").then((data) => {
    console.log(data)
    var metaData= data.metadata;
    var resultsarray= metaData.filter(sampleobject => 
      sampleobject.id == sample);
    var result= resultsarray[0]

//select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

// clear any existing metadata
    panel.html("");

// add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

  });
}



//=============Bubble& Bar Chart Functions=======================

function makeCharts(sample) {

// get sample data for the plots 
d3.json("data/samples.json").then((data) => {
  var datasamples= data.samples;
  var resultsarray= datasamples.filter(sampleobject => 
      sampleobject.id == sample);
  var result= resultsarray[0]

  var ids = result.otu_ids;
  var labels = result.otu_labels;
  var values = result.sample_values;


//================ Bubble Chart================= 


  var layoutBubblePlot = {
    margin: { t: 0 },
    xaxis: { title: "OTU ID" },
    hovermode: "closest",
    };

    var bubbleData = [ 
    {
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        color: ids,
        size: values,
        }
    }
  ];

  Plotly.newPlot("bubble", bubbleData, layoutBubblePlot);



//=============== BAR Chart=======================
var barLayout = {
    
  margin: { t: 40, l: 100 }
};


  var barData =[
    {
      y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x:values.slice(0,10).reverse(),
      text:labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"

    }
  ];



  Plotly.newPlot("bar", barData, barLayout);
});
}

// colors for gauge
var gaugeChartColor = ["#84b589", "#89bc8d", "#8ac086", "#b7cd8f", "#d5e599", "#e5e8b0", "#e9e6c9", "#f4f1e4", "#f8f3ec", "#FFFFFF"];


//=============Gauge Chart Function=======================

function gaugePlot(sample) {
  console.log("sample", sample);

  d3.json("data/samples.json").then(data =>{

    var objs = data.metadata;
    

    var matchedSample = objs.filter(sampleData => 
      sampleData["id"] === parseInt(sample));
    gaugeChart(matchedSample[0]);
 });   
}



//=============== GAUGE Chart ==================

function gaugeChart(data) {
  console.log("gaugeChart", data);

  if(data.wfreq === null){
    data.wfreq = 0;

  }

  var degree = parseInt(data.wfreq) * (180/10);

  // calculate the meter point
  var degrees = 180 - degree;
  var radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  var path = mainPath.concat(pathX, space, pathY, pathEnd);
  
  var trace = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 50, color:'2F6497'},
      showlegend: false,
      name: 'WASH FREQ',
      text: data.wfreq,
      hoverinfo: 'text+name'},
    { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
    textinfo: 'text',
    textposition:'inside',
    textfont:{
      size : 16,
      },
    marker: {colors:[...gaugeChartColor]},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
    hoverinfo: 'text',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '#2F6497',
        
        line: {
          color: '#2F6497'
        }
      }],

    title: '<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week',
    height: 550,
    width: 550,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
  };

  Plotly.newPlot('gauge', trace, layout, {responsive: true});

}
 

//============= initial data rendering =======================

function init() {

// dropdown menu
var dropdown = d3.select("#selDataset");

// read data 
d3.json("data/samples.json").then((data) => {
  console.log(data)

  var sampleNames = data.names;

  sampleNames.forEach((sample) => {
    dropdown.append("option").text(sample).property("value", sample);
  });

  // use the first sample from the list to create the first plots
  const firstSample = sampleNames[0];
  metaData(firstSample);
  makeCharts(firstSample);
  gaugePlot(firstSample)


});
}

function optionChanged(newSample) {
// get new data each time a new sample is selected
metaData(newSample);
makeCharts(newSample);
gaugePlot(newSample)

}



// initialize 
init();