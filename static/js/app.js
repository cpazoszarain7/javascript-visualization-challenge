
//Get Data From Json File and initialize arrays with data
var names;
var metadata;
var samples;

url = 'samples.json'

d3.json(url).then(function(data) {

    names = data.names;
    metadata = data.metadata;
    samples = data.samples;

    //Initialize dropdown menu of Ids
    dropID = d3.select('#selDataset')
    names.forEach(item =>{

    op = dropID.append('option')
    op.text(item)

    })
    //Once populated trigger dropdown event to have initial data
    d3.select("#selDataset").dispatch("change");
    
})

function patientData(index){

    //Populate Patient Data
    patient_data = d3.select('#sample-metadata')
    //Clear any HTML
    patient_data.html("")
    //Create <p> tags to display data
    patient_data.append('p').text(`id: ${metadata[index].id}`)
    patient_data.append('p').text(`ethnicity: ${metadata[index].ethnicity}`)
    patient_data.append('p').text(`gender: ${metadata[index].gender}`)
    patient_data.append('p').text(`age: ${metadata[index].age}`)
    patient_data.append('p').text(`location: ${metadata[index].location}`)
    patient_data.append('p').text(`bbtype: ${metadata[index].bbtype}`)
    patient_data.append('p').text(`wfreq: ${metadata[index].wfreq}`)

    //Update Dashboard title
    d3.select('#main_title').text(`Subject ID ${samples[index].id} Belly Button Biodiversity Dashboard`)

}

function plotBarChart(index){

    //Horizontal Bar Chart of top 10 OTUs of Selected Patient
    var otus_values = samples[index].sample_values.slice(0,10);
    otus_values.reverse();
    
    //Get Labels for bar chart
    var otus_ids = samples[index].otu_ids.slice(0,10);   
    var labels = [];
    otus_ids.forEach(item => labels.push(`OTU ${item}`));
    labels.reverse();

    //Plot the Bar chart
    var trace1 = {
        x: otus_values,
        y: labels,
        type: 'bar',
        orientation: 'h'
    };

    var layout = {
        title: `<b>Top 10 OTUs</b> <br> Found in subject ID ${samples[index].id}`,
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    };

    var config = {
        responsive: true
    };

    Plotly.newPlot('bar',[trace1],layout, config);

}

function plotBubbleChart(index){
    //Plot Bubble Chart
    var trace1 = {
        x: samples[index].otu_ids,
        y: samples[index].sample_values,
        mode: 'markers',
        text: samples[index].otu_labels,
        marker: {
            size: samples[index].sample_values,
            color: samples[index].otu_ids
        }
    };
    
    var data = [trace1];
    
    var layout = {
    title: 'OTUs Values',
    showlegend: false, 
    xaxis: {
        title: {
          text: 'OTUs IDs',
          
        }
      }
    };

    var config = {
        responsive: true
    };
      
      Plotly.newPlot('bubble', data, layout, config);

}

function plotGaugeChart(index){


    // Enter a speed between 0 and 180
    var level = metadata[index].wfreq*180/10;

    // Trig to calc meter point
    var degrees = 180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
    x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'speed',
        text: level,
        hoverinfo: 'text+name'},
    { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6',
                '4-5', '3-4', '2-3', '1-2','0-1', ''],
    textinfo: 'text',
    textposition:'inside',	  
    marker: {colors:['#481567FF', '#453781FF',
                            '#39568CFF', '#287D8EFF',
                            '#1F968Bff', '#29AF7FFF',
                            '#55C667FF', '#95D840FF', 
                            '#FDE725FF', 'rgba(255, 255, 255, 0)']},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2','0-1', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
    }];

    var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
            color: '850000'
        }
        }],
    title: '<b>Belly Button Washing Frequency</b> <br> Scrubs Per week',
    height: 450,
    width: 500,
    xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout, {showSendToCloud:true});

}

function fillTableData(index){

    //populate Table with details    
    let tbody = d3.select('tbody');
    tbody.html("")

    for (let j = 0; j < samples[index].otu_ids.length; j++) {
        
        row=d3.select('tbody').append('tr')
        row.append('td').text(samples[index].otu_ids[j])
        row.append('td').text(samples[index].sample_values[j])
        row.append('td').text(samples[index].otu_labels[j])

        
    }

   
}


// Select the DropDown
d3.select("#selDataset").on("change", handleSelect);


// Complete the event handler function for the form
function handleSelect(event) {
    
//Get the selected ID
var dropdown = d3.select(this);
var ID = dropdown.property("value");

//Add demographic Data
//Find Metadata for selected ID
index = metadata.findIndex(item => item.id ===parseInt(ID));

//Populate patient data
patientData(index);

//Plot Bar Chart
plotBarChart(index);

//Plot Buble Chart
plotBubbleChart(index);

//Plot Gauge Chart
plotGaugeChart(index);

//Fill Table Data
fillTableData(index);


};













  