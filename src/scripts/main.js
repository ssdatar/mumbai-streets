var map = L.map('map', {
  zoom: 12,
  center: [18.9920833,72.8636392]
});


L.tileLayer('http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png', 
    {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  maxZoom: 18
}).addTo(map);


$.getJSON('data/mum-small.json').done(geoData);

function geoData(data) {
  var geoJson = L.geoJSON(data, {
    style: style,
    onEachFeature: onEachFeature
  });

  geoJson.addTo(map);

  map.on('zoomend', function() {
    if(map.getZoom() > 13) {
      geoJson.setStyle({weight: 3});
    } else {
      geoJson.setStyle({weight: 1});
    }
  });
}

function onEachFeature(feature, layer) {
  var tooltip = feature.properties.name;
  layer.bindPopup('<p>Name: '+ tooltip + '</p>');
}

function style(feature, layer) {
}