import Ember from 'ember';

export default Ember.Controller.extend({

  route: null,

  filteredSites: null,

  range: null,

  getDistanceFromLatLonInMi: function(lat1,lon1,lat2,lon2) {
    var R = 3963; // Radius of the earth in mi
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in mi

    return d;
  },

  deg2rad: function(deg) {
    return deg * (Math.PI/180)
  },

  // recalcSites: function() {
  //   Ember.run.once(this, 'buildSites');
  // }.observes('model.@each'),

  // This is happening Over and Over and Over again!
  buildSites: function () {
    var filteredSites = this.get('model');
    var route = this.get('route');
    var range = this.get('range');
    var _this = this;
    filteredSites = filteredSites.filter(function(site){
      var lat = parseFloat(site.get('latitude'));
      var long = parseFloat(site.get('longitude'));
      var found = route.reduce( function(withinBounds, point){
        return withinBounds || 
          range >= _this.getDistanceFromLatLonInMi(lat, long, point[0], point[1])
      }, false);
      return found;
    });
    this.set('filteredSites', filteredSites);
    return filteredSites.length;
  }.observes('model'),
});