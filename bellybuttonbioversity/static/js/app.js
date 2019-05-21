function buildMetadata(sample) {

    var selector = d3.select("#sample-metadata")

    d3.json(`/metadata/${sample}`).then((data) => {
      selector.html("");

      Object.entries(data).forEach(([key, value]) => {
        selector.append("h3").text(`${key}: ${value}`);
      });
    }); 
  }
// BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then(function(data1) {
    var trace1 = {
      x: data1.otu_ids,
      y: data1.sample_values,
      text: data1.otu_labels,
      mode: 'markers',
      marker: {
        color: data1.otu_ids, 
        size: data1.sample_values
        }
      }
    var data1 = [trace1];
  
    var layout1 = {
      showlegend: false,
      xaxis: {
        title: {
          text: 'OTU ID',
          font: {
            family: 'Courier New, monospace',
            size: 18
          }
        },
      },
    };
    var BUBBLE = document.getElementById("bubble");

    Plotly.newPlot(BUBBLE, data1, layout1, {responsive: true});
});

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data2) => {

      var trace2 = {
        labels: data2.otu_ids.slice(0,10),
        values: data2.sample_values.slice(0,10),
        type: "pie",
        hoverinfo: data2.otu_labels.slice(0,10)
      }

      var data2 = [trace2]

      var layout2 = {
        title: `Sample #: ${sample}`,
        height: 400,
        width: 500
      };
      var PIE = document.getElementById("pie");

      Plotly.newPlot(PIE, data2, layout2, {responsive: true});
    })

    // d3.jason(`/wfreq/${sample}`).then((data3) => {

    //   // Enter a speed between 0 and 180
    //     var level = 175;

    //     // Trig to calc meter point
    //     var degrees = 180 - level,
    //         radius = .5;
    //     var radians = degrees * Math.PI / 180;
    //     var x = radius * Math.cos(radians);
    //     var y = radius * Math.sin(radians);

    //     // Path: may have to change to create a better triangle
    //     var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
    //         pathX = String(x),
    //         space = ' ',
    //         pathY = String(y),
    //         pathEnd = ' Z';
    //     var path = mainPath.concat(pathX,space,pathY,pathEnd);

    //     var data3 = [{ type: 'scatter',
    //       x: [0], y:[0],
    //         marker: {size: 28, color:'850000'},
    //         showlegend: false,
    //         name: 'speed',
    //         text: level,
    //         hoverinfo: 'text+name'},
    //       { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
    //       rotation: 90,
    //       text: ['0-1', '1-2', 'Fast', 'Average',
    //                 'Slow', 'Super Slow', ''],
    //       textinfo: 'text',
    //       textposition:'inside',
    //       marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
    //                             'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
    //                             'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
    //                             'rgba(255, 255, 255, 0)']},
    //       labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
    //       hoverinfo: 'label',
    //       hole: .5,
    //       type: 'pie',
    //       showlegend: false
    //     }];

    //     var layout3 = {
    //       shapes:[{
    //           type: 'path',
    //           path: path,
    //           fillcolor: '850000',
    //           line: {
    //             color: '850000'
    //           }
    //         }],
    //       title: '<h3><b>Belly Button Washing Frequency</b></h3> <br> Scrubs per Week',
    //       height: 1000,
    //       width: 1000,
    //       xaxis: {zeroline:false, showticklabels:false,
    //                 showgrid: false, range: [-1, 1]},
    //       yaxis: {zeroline:false, showticklabels:false,
    //                 showgrid: false, range: [-1, 1]}
    //     };
    //     GAUGE = document.getElementById("gauge")
    // //     Plotly.newPlot(GAUGE, data3, layout3, {responsive: true});
    // })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
