var map = L.map('map', {
  zoom: 12,
  center: [18.9920833,72.8636392]
});

// mapboxgl.accessToken = 'pk.eyJ1Ijoic3NkYXRhciIsImEiOiJjaW0wMTh3a3owOGlldTBrc3IxeDN6b2htIn0.iXmePtlBTCRB6JM7q-xDcg';

// var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/light-v9',
//     center: [18.9920833,72.8636392].reverse(),
//     zoom: 12
// });

// L.mapbox.accessToken = 'pk.eyJ1Ijoic3NkYXRhciIsImEiOiJjaW0wMTh3a3owOGlldTBrc3IxeDN6b2htIn0.iXmePtlBTCRB6JM7q-xDcg';

// var map = L.mapbox.map('map', 'mapbox.light').setView([18.9920833,72.8636392], 12),
//     layer = L.geoJson(null, { style: { color: '#333', weight: 1 }});

// map.addLayer(layer);

L.tileLayer('http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png', 
    {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  maxZoom: 18
}).addTo(map);

L.TopoJSON = L.GeoJSON.extend({  
  addData: function(jsonData) {    
    if (jsonData.type === "Topology") {
      for (key in jsonData.objects) {
        geojson = topojson.feature(jsonData, jsonData.objects[key]);
        L.GeoJSON.prototype.addData.call(this, geojson);
      }
    }    
    else {
      L.GeoJSON.prototype.addData.call(this, jsonData);
    }
  }  
});
// Copyright (c) 2013 Ryan Clark

var topoLayer = new L.TopoJSON();

$.getJSON('data/mumbai.topo.json')
.done(addTopoData); 

function geoData(data) {
  var geoJson = L.geoJSON(data, {
    style: style,
    onEachFeature: onEachFeature
  });

  geoJson.addTo(map);

  map.on('zoomend', function() {
    if(map.getZoom() > 13) {
      geoJson.setStyle({weight: 3});
    }
  })
}

function onEachFeature(feature, layer) {
  var tooltip = feature.properties.name;
  layer.bindPopup('<p>Name: '+ tooltip + '</p>');
}

function style(feature, layer) {
  return { weight: 1};
}

function addTopoData(topoData){
  // var streets = topojson.feature(topoData, topoData.objects.mumbai)
  // layer.addData(streets);

  // map.on('load', function() {
  //   map.addSource("road", {
  //     type: "geojson",
  //     data: topoData
  //   });

  //   map.addLayer({
  //     "id": "road",
  //     "type": "line",
  //     "source": "road",
  //     "layout": {
  //         "line-join": "round",
  //         "line-cap": "round"
  //     },
  //     "paint": {
  //         "line-color": "#888",
  //         "line-width": 1
  //     }
  //   });

  //   map.on('click', function (e) {
  //     var features = map.queryRenderedFeatures(e.point, { layers: ['road'] });
  //     if (!features.length) {
  //         return;
  //     }

  //     var feature = features[0];

  //     var popup = new mapboxgl.Popup()
  //         .setLngLat(map.unproject(e.point))
  //         .setHTML(feature.properties.name)
  //         .addTo(map);
  //   });

  //   map.on('mousemove', function (e) {
  //     var features = map.queryRenderedFeatures(e.point, { layers: ['road'] });
  //     map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  //   });

  // });
  
  console.log(topoData);


  topoLayer.addData(topoData);
  topoLayer.addTo(map);

  topoLayer.eachLayer(function(layer) {
    if (layer.feature.properties.name !== null) {
      layer.setStyle({
        weight: 1
      });
    } else {
      layer.setStyle({
        weight: 0
      });
    }

    

    layer.on({
      mouseover: function() {
        var tooltip = this.feature.properties.name;
        layer.bindPopup('<p>Name: '+ tooltip + '</p>');
      }
    });
  });

  map.on('zoomend', function() {
    if(map.getZoom() > 13) {
      topoLayer.setStyle({weight: 3});
    } else {
      topoLayer.setStyle({ weight: 1});
    }
  })


}