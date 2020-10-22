function buildMetadata(sample) {

    var selector = d3.select("#sample-metadata")

    d3.json(`/metadata/${sample}`).then((data) => {
      selector.html("");

      Object.entries(data).forEach(([key, value]) => {
        selector.append("h3").text(`${key}: ${value}`);
      });
      buildGauge(data.WFREQ);
    }); 
  }


function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then((data1) => {
    var trace1 = {
      x: data1.otu_ids,
      y: data1.sample_values,
      text: data1.otu_labels,
      mode: 'markers',
      marker: {
        color: data1.otu_ids, 
        size: data1.sample_values,
        colorscale: "Earth"
        }
      }
    var data1 = [trace1];
  
    var layout1 = {
      title: `Bacteria Values for Sample: ${sample}`,
      showlegend: false,
      xaxis: {
        title: {
          text: 'Microbial "Species" or Operational Taxonomic Unit (OTU) ID',
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
        
      };
      var PIE = document.getElementById("pie");

      Plotly.newPlot(PIE, data2, layout2, {responsive: true});
    })
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
