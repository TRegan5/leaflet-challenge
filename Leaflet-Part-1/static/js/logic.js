// Store earthquake API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  features = data.features;
  console.log(data.features);
  // 1.
  // Pass the features to a createFeatures() function:
  createMap(features);
  //createFeatures(data.features);

  
});

function createMap(earthquakeData) {
  function quakeInfo(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
                    <p>Magnitude: ${feature.properties.mag}</p>
                    <p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  earthquakes = L.geoJSON(earthquakeData, 
    {
      onEachFeature: quakeInfo
    }
  );
  function location(feature) {
    return [feature.geometry.coordinates[0], feature.geometry.coordinates[1]]
  }
  function markerSize(feature) {
    return Math.sqrt(feature.properties.mag)*100;
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

  // Create base layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  //let grayscale = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    //attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  //});
  // Create baseMaps object
  let baseMaps = {
    'Street Map': street,
    //'Grayscale Map': grayscale
  };
  
  // Create overlay object to hold our overlay
  let overlayMaps = {
    'Earthquakes': earthquakes
  };
    
  // Create map, giving it streetmap and earthquakes layers to display on load
  let myMap = L.map('map', {
    center: [
      37.09, -95.71
    ],
    zoom: 2,
    layers: [street]//, earthquakes]
  });
  for (i = 0; i < features.length; i++) {
    quake = features[i];
    // Conditionals for country points
    L.circle(location(quake), {
      stroke: false,
      fillOpacity: 0.75,
      color: quakeDepthColor(quake),
      radius: markerSize(quake)
    }).addTo(myMap);
    //console.log(quake);
  }
  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
  