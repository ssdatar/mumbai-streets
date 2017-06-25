import * as L from 'leaflet';
import {
  event,
  selection,
  select,
  selectAll
} from "d3-selection";
import { json } from 'd3-request';

const isMobile = window.innerWidth < 600;
const initZoom = (isMobile) ? 13 : 12;

const map = L.map('map', {
  zoom: initZoom,
  center: [18.9920833,72.8284905079636]
  //center: [18.9920833, 72.9195392]
});

var darkMap = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
  stamen = 'http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png';

var mapLayerGroups = {};

L.tileLayer(darkMap, 
    {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  minZoom: 12,
  maxZoom: 18
}).addTo(map);


var streetLookup = {};


const categ = select('#categ'),
      infoBox = select('#info-box'),
      loading = select('.loading'),
      $map = select('#map'),
      $infoTip = select('#popover');

const current = categ.property('value');

// Get JSON and build map
json('data/streets.json', geoData);

categ.on('change', () => {
  var selected = categ.property('value');
  map.setZoom(12);
  showLayer(selected, current);
});

/******************************************
******* FUNCTION THAT DRAWS THE MAP *******
*******************************************/

function geoData(data) {

  loading.style('display', 'none');

  var geoJson = L.geoJSON(data, {
    style: style,
    onEachFeature: onEachFeature
  });

  geoJson.addTo(map);


  map.on('zoomend', () => {

    const weight = getWeight(map.getZoom());
    // console.log(map.getZoom(), weight)
    geoJson.setStyle({weight: weight});
  });
}

/******************************************
******* CLICK EVENT FUNCTION ON EACH FEATURE *******
*******************************************/

function onEachFeature(feature, layer) {
  var name = `<h4>${feature.properties.n}</h4>`;
  
  // A call-to-action for anyone who knows more about a street in case I have missed out on adding. Which I probably have
  var addInfo = `<p>Know about this street? Think there's a mistake? <a href="mailto:saurabhsdatar+mumbaistreets@gmail.com?subject=About ${feature.properties.osm_id}&body=Hi, I know more about this street. Could you please write back about this?">Send me an email</a></p>`;
  
  var text = (feature.properties.d.length > 1) ? feature.properties.d : addInfo;
  
  var readMore = (feature.properties.l.length > 1) ?   
                `<p class="more"><a href="${feature.properties.l}" target="_blank">Read more...</a></p>` : 
                '';

  var current = this;

  const tooltip = `<p>${text + readMore}</p>`;

  streetLookup[feature.properties.osm_id] = layer;

  layer.on('click', function (e) {

    // Highlight on click
    this.setStyle({color: 'yellow'});

    map.flyTo(e.latlng, map.getZoom());

    console.log(tooltip)
    
    infoBox.classed('show', true)
      .html(name + tooltip);
  });

  // Highlight street on highlight
  layer.on('mousemove', function(e) {
    this.setStyle({
      color: 'yellow',
      weight: 8
    });
    
    if (!isMobile) {
      placeTooltip(e.originalEvent.clientX, e.originalEvent.clientY, this.feature.properties.n);
    }    
  });
  

  // Reset highlights and hide tooltip.
  layer.on('mouseout', function(e) {
    this.setStyle(style(this.feature));

    $infoTip.classed('show', false);
  })
}

function placeTooltip(x, y, info) {
  const mapWidth = $map.style('width');

  $infoTip.classed('show', true);

  if (x > mapWidth - 200) {
    $infoTip.style('left', mapWidth - 200 + 'px')
    .style('top', y + 50 + 'px')  

  } else {
    $infoTip.style('left', x + 50 + 'px')
    .style('top', y - 20 + 'px')
  }

  $infoTip.html(`<p>${info}</p>`);
}

/******************************************
******* CLICK EVENT FUNCTION ON EACH FEATURE *******
*******************************************/

function style(feature) {

  const colorLookup = {
    'm': '#21abcd',
    'f': '#cd5c5c',
    'na': '#fff'
  };

  return {
    color: colorLookup[feature.properties.g],
    weight: getWeight(map.getZoom())
  }
}


function getWeight(zoom) {

  if (zoom > 15) {
    return 7;
  }

  if (zoom > 13 && zoom <= 15) {
    return 5;
  }

  return 2;
}

/******************************************
******* Show or hide streets based on what category is selected *******
*******************************************/
function showLayer(id) {

  for (var i in streetLookup) {
    if (streetLookup[i].feature.properties.c !== id && id !== 'all') {
      map.removeLayer(streetLookup[i]);
    } else {
      map.addLayer(streetLookup[i]);
    }
  }

}