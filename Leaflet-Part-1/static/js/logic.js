// Store earthquake API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.

  // 1.
  // Pass the features to a createFeatures() function:
  createFeatures(data.features);

});

// 2.
function createFeatures(earthquakeData) {
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function PlaceAndTime(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
                    <p>${new Date(feature.properties.time)}</p>`);
  }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, 
    {
    onEachFeature: PlaceAndTime
    }
  );
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);

}

function createMap(earthquakes) {
    // Create base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
      let grayscale = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    // Create baseMaps object
    let baseMaps = {
      'Street Map': street,
      'Grayscale Map': grayscale
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
      layers: [street, earthquakes]
    });  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);  
  }
  