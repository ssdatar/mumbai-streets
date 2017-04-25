import { select } as 'd3.select' from 'd3-selection';
import { json } from 'd3-request';
import * from 'd3-queue';

var map = L.map('map', {
  zoom: 12,
  center: [18.9920833,72.8636392]
});

var darkMap = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
  stamen = 'http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png';

var mapLayerGroups = {};

L.tileLayer(darkMap, 
    {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  maxZoom: 18
}).addTo(map);


var streetLookup = {};

$.getJSON('data/streets.json').done(geoData);

var current = $('#categ').val();

$('#categ').on('change', function() {
  var selected = $('#categ').val();
  showLayer(selected, current);
});

/******************************************
******* FUNCTION THAT DRAWS THE MAP *******
*******************************************/

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
      geoJson.setStyle({weight: 1.5});
    }
  });
}

function onEachFeature(feature, layer) {
  var tooltip = feature.properties.d;

  streetLookup[feature.properties.osm_id] = layer;

  layer.on('click', function(e) {
    $('#info-box').html('<p>'+ feature.properties.n + '</p><p>' + tooltip + '</p>')
  });

}

function style(feature, layer) {

  if(feature.properties.g === 'm') {
    return {
      color: '#21abcd',
      weight: 1.5
    };
  }

  if (feature.properties.g === 'f') {
    return {
      color: '#cd5c5c',
      weight: 1.5
    };
  }

  return {
      // opacity: 0,
      color: '#fff',
      weight: 1.5
    };
}


/*
* show/hide layerGroup   
*/
function showLayer(id) {

  for (var i in streetLookup) {
    if (streetLookup[i].feature.properties.c !== id && id !== 'all') {
      map.removeLayer(streetLookup[i]);
    } else {
      map.addLayer(streetLookup[i]);
    }
  }

}