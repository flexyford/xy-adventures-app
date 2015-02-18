import Ember from 'ember';

export default Ember.Component.extend({
    tagName: ['div'],
    classNames: ['about-section'],

    attributeBindings: ['anchor:id'],

    anchor: "about",

    aboutTiles:[ {
      "id": 1,
      "text": "Plan Your Route",
      "img": 'assets/images/map41.png',
      "attrId": "step-icon"
    }, {
      "id": 2,
      "text":  "Find Airbnbs",
      "img": 'assets/images/map46.png',
      "attrId": "step-icon"
    }, {
      "id": 3,
      "text":  "Start Exploring",
      "img": 'assets/images/nature1.png',
      "attrId": "step-icon"
    } ]
});
