import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  host: 'http://api-bnb.herokuapp.com',
  //host: 'http://localhost:3000',
  headers: {
    'Accept': 'application/json, text/html, text/javascript'
  }
});
