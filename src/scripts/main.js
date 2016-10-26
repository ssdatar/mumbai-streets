mapboxgl.accessToken = 'pk.eyJ1Ijoic3NkYXRhciIsImEiOiJjaW0wMTh3a3owOGlldTBrc3IxeDN6b2htIn0.iXmePtlBTCRB6JM7q-xDcg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [18.9920833,72.8636392].reverse(),
    zoom: 12
});


$.getJSON('data/mumbai.json').done(addTopoData); 


function addTopoData(data){

  map.on('load', function() {
    map.addSource("road", {
      type: "geojson",
      data: data
    });

    map.addLayer({
      "id": "road",
      "type": "line",
      "source": "road",
      "layout": {
          "line-join": "round",
          "line-cap": "round"
      },
      "paint": {
          "line-color": "#888",
          "line-width": 1.2
      }
    });

    map.on('click', function (e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['road'] });
      if (!features.length) {
        return;
      }

      var feature = features[0];
      var coordinates = feature.geometry.coordinates;

      var popup = new mapboxgl.Popup()
      .setLngLat(map.unproject(e.point))
      .setHTML(feature.properties.name)
      .addTo(map);

      // Zoom to selected street
      var bounds = coordinates.reduce(function(bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      map.fitBounds(bounds, {
        padding: 20
      });
    });

    map.on('mousemove', function (e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['road'] });
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });

    map.on('zoom', function(e) {
      if (map.getZoom() > 13) {
        map.setPaintProperty('road', 'line-width', 3);
      } else {
        map.setPaintProperty('road', 'line-width', 1.2);
      }
    })

  });
}