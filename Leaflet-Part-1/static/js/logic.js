// Store earthquake API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  features = data.features;
  console.log(data.features);
  let myMap = L.map('map', {
    center: [
      37.09, -95.71
    ],
    zoom: 2
  });
  // Create base layers
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  function location(feature) {
    return [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
  }
  function markerSize(feature) {
    return (feature.properties.mag*10)**3;//
  }
  function quakeDepthColor(feature) {
    depth = feature.geometry.coordinates[2];
    if (depth < 10) {
      color = '#00ff00';
    }
    else if (depth < 30) {
      color = '#ffff00';
    }
    else if (depth < 50) {
      color = '#ffcc66';
    }
    else if (depth < 70) {
      color = '#ffcc00';
    }
    else if (depth < 90) {
      color = '#ff9900';
    }
    else {
      color = '#ff0000';
    }
    return color; 
  }
  
  // Create map, giving it streetmap and earthquakes layers to display on load
  for (i = 0; i < features.length; i++) {
    quake = features[i];
    // Conditionals for country points
    L.circle(location(quake), {
      weight: 0.11,//stroke: false,
      fillOpacity: 0.5,
      color: 'black',
      fillColor: quakeDepthColor(quake),
      radius: markerSize(quake)
    }).bindPopup(`<h3>${quake.properties.place}</h3><hr>
                  <p>Magnitude: ${quake.properties.mag}</p>
                  <p>Depth: ${quake.geometry.coordinates[2]}</p>`).addTo(myMap);
    console.log(quake);
  }
  L.control.Legend({
    position: 'bottomright',
    collapsed: 'false',
    opacity: 1,
    legends: [{
      label: '-1 - 10',
      type: 'rectangle',
      fillColor: '#00ff00'
      
    }]
  }).addTo(myMap);
});