var map = L.map('map', {
  zoom: 12,
  center: [18.9920833,72.8636392]
});

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

function addTopoData(topoData){  
  topoLayer.addData(topoData);
  topoLayer.addTo(map);
}