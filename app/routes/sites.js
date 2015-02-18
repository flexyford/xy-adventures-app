import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
  // this.store.pushPayload('site', data);
     return this.store.all('site');
  },

  actions: {
    search: function(query) {
      var store = this.store;
      // THE BELOW IS EQUIVALENT BUT SLOWER
      var _this = this;
      var controller = this.controllerFor('sites');

      store.find('site', query)
      .then(function(result){
        controller.get('model').forEach( function(site) {
          store.unloadRecord(site);
        });
        controller.set("model", result);
        alert('Success! Found Sites for ' + query + '!');
      })
      .catch(function(){
        alert('Failed to request Sites for ' + query + '!');
      });
    }
  }
});
