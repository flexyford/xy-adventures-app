import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "div",
  classNames: ['hero-words'],

  baseImageUrl: "assets/images",

  heroImage: true,

  heroButtons:[ {
      "id": 1,
      "class": "button radius",
      "attrId": "hero-button1",
      "content": "Plan Your Trip",
      "link-to": "sites"
    }, {
      "id": 2,
      "class":  "button radius",
      "attrId": "hero-button2",
      "content": "How It Works",
      "anchor-to": "about"
    } ],

  heroUrl: function(){
    return this.get('baseImageUrl') + "/xy_nav_clear_diamond.png";
  }.property('baseImageUrl')

});

  
