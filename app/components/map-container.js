import Ember from 'ember';
// import { L as L } from 'mapbox.js';

export default Ember.Component.extend({
  classNames: ['map'],

  map: {},

  waypoints: null,

  route: null,

  range: null,

  mySites: null,

  setup: function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiYWZvcmQiLCJhIjoiZ2RNeFNBMCJ9.Cv94HqHAWfhIuE6vx7QMlw';
    var map = L.mapbox.map('map', 'aford.l4a1dfc2');
    this.set('map', map);
    this.set('range', 5)
  }.on('didInsertElement'),
  
  dropMarkers: function() {
    var sites = this.get('mySites');
    var map = this.get('map');
    var geojson = { "type": "FeatureCollection", "features": [] };

    if (sites.length > 0) {
      // Build All Pin Markers for this new layer
      // var markers = [];
      sites.forEach( function(site){
        var lat = parseFloat(site.get('latitude'));
        var lng = parseFloat(site.get('longitude'));
        var description = site.get('meta').location;
        var img = site.get('meta').imgUrl;
        var url = site.get('url');
        var title_str = site.get('name') + " - $" + site.get('price');


        geojson['features'].push(
          {
            "type": "Feature", 
            "geometry": 
            {
              "type": "Point",
              "coordinates": [lng,lat]
            },
            'properties': {
              "title": title_str,
              "description": description,
              "image": img,
              "url": url,
              'marker-color': "#03A9F4"
            }
          });
      });

      var featureLayer = L.mapbox.featureLayer(geojson).addTo(map);
      featureLayer.eachLayer(function(layer) {
        // here you call `bindPopup` with a string of HTML you create - the feature
        // properties declared above are available under `layer.feature.properties`
        var content = 
        '<a target="_blank" class="popup" href="' + layer.feature.properties.url + '">' +
          '<p>' + layer.feature.properties.title + '</p>' +
          layer.feature.properties.description +
          '<img src="' + layer.feature.properties.image + '" />' +  
        '</a>'
        layer.bindPopup(content);
      });

      this.removeLayer();
      this.set('layer', featureLayer);
      map.fitBounds(featureLayer.getBounds());
    }
        
    console.log("Droping " + sites.length + " Sites!");

  }.observes('mySites.@each'),
  
  buildFeatureLayer: function(geojson) {
    var map = this.get('map');
    return ;
  },
  
  removeLayer: function() {
    var currentLayer = this.get('layer');
    var map = this.get('map');
    if (currentLayer) {
      map.removeLayer(currentLayer);
    }
  },

  actions: {
    buildQuery: function() {
      var origin = this.get('start');
      var destination = this.get('end');
      console.log("start: " + origin + "\nend: " + destination);

      // THE BELOW IS EQUIVALENT BUT SLOWER
      var _this = this;

      // TODO - Build Route Using Mapbox Directions
      var accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q';
      var origin_req_url = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/" + 
             origin + ".json?access_token=" + accessToken;
      var dest_req_url = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/" + 
             destination + ".json?access_token=" + accessToken;

      var origin_coordinates;
      var destination_coordinates;

      // Request Origin Coordinates
      Ember.$.when(Ember.$.ajax({
        url: origin_req_url
      })).then( function(result) {
        // alert('Requested Waypoints for ' + origin + '!');
        origin_coordinates = result.features[0].center.join();
        // Request Destination Coordinates
        Ember.$.when(Ember.$.ajax({
          url: dest_req_url
        })).then( function(result) {
          // alert('Requested Waypoints for ' + destination + '!');
          destination_coordinates = result.features[0].center.join();
          // Request Waypoints along route
          var route_url = "http://api.tiles.mapbox.com/v4/directions/mapbox.driving/" + 
            origin_coordinates + ";" + destination_coordinates + ".json?access_token=" + accessToken;

          Ember.$.when(Ember.$.ajax({
            url: route_url
          })).then( function(result) {
            _this.set('route', result);
            alert('Requesting Waypoints for ' + origin + " to " + destination + '!');
            var waypoints = result.routes[0].geometry.coordinates
            .map(function(item){
              // Flip from [LNG,LAT] to [LAT,LNG]
              return [item[1], item[0]];
            });
            _this.set('waypoints', waypoints);
            var uriLen = encodeURIComponent(JSON.stringify(waypoints)).length
            var mod = Math.ceil(uriLen / 2000);
            var filtered_waypoints = waypoints
            .filter(function(item, idx) {
              return (idx % mod === 0);
            });

            _this.sendAction('search', {route: JSON.stringify(filtered_waypoints)});
          });
        });
      });
    },
  }
});