import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  name: DS.attr('string'),
  price: DS.attr('number'),
  url: DS.attr('string'),
  location: DS.attr('string'),
  latitude: DS.attr('number'),
  longitude: DS.attr('number'),
  city: DS.attr('string'),
  country: DS.attr('string'),
  zipcode: DS.attr('string'),
  address: DS.attr('string'),
  meta: DS.attr()
});

