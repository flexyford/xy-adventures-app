import Ember from 'ember';
import TextField from '../overrides/textfield';

export default Ember.Component.extend({
  classNames: ['filter-section'],

  attributeBindings: ['id'],

  isPopularToggled: false,

  dateRange: null,

  id: "filter-section",

  actions: {
    
  }
  // Austin -97.7431,30.2671;-97.9414,29.883

});