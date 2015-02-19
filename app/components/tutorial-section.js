import Ember from 'ember';

export default Ember.Component.extend({
  tagName: ['div'],
  classNames: ['tutorial-section'],

  attributeBindings: ['anchor:id'],

  anchor: "tutorial",

  currentImageIdx: 0,

  tutorialTiles:[ {
    "id": 1,
    "title": "How To Scrape Airbnb!",
    "text": "XY-Adventures is Built On an Airbnb Web Scraper",
    "img": 'assets/images/airbnbmap.jpg'
  }, {
    "id": 2,
    "title": "What is Airbnb?",
    "text": "Airbnb lets you rent unique places from local hosts in over 190 countries",
    "img": 'assets/images/Slide_A.png'
  }, {
    "id": 3,
    "title": "Search Techniques - Part 1 - Location Search",
    "text": "Search by City State Zip",
    "img": 'assets/images/search.png'
  }, {
    "id": 4,
    "title": "Search Techniques - Part 2 - Coordinate Search",
    "text": "Take a closer look . . . Search By Map +/- Buttons AND Latitude Longitude Coordinated in URL",
    "img": 'assets/images/search.png'
  }, {
    "id": 5,
    "title": "Search Techniques - Part 3 - Limits",
    "text": "Airbnb sets limits on the amount of locations they share in a queried area.\n1000+ Rentals means we need to query a smaller area",
    "img": 'assets/images/Slide_C1_Large.png'
  }, {
    "id": 6,
    "title": "Search Techniques - Part 4 - Zoom",
    "text": "Continue Zooming-In Until All locations within Coordinates are available . . . then begin scraping HTML.",
    "img": 'assets/images/Slide_C2_Large.png'
  }, {
    "id": 7,
    "title": "Search Techniques - Part 5 - The DOM",
    "text": "Inspect the DOM Element for a location. Airbnb lists lat/lng coordinates in DOM meta-data. We now have enough information to start scraping!",
    "img": 'assets/images/Slide_D.png'
  }, {
    "id": 8,
    "title": "Partition the US",
    "text": "What is the best way to split up scraping a large area without reaching Airbnb server limits?",
    "img": 'assets/images/Slide_0_Blank.png'
  }, {
    "id": 9,
    "title": "Partition the US - Part 2",
    "text": "Split an area into smaller equal parts",
    "img": 'assets/images/US_3_Split.png'
  }, {
    "id": 10,
    "title": "Partition the US - Part 3",
    "text": "Inspect A Random Area",
    "img": 'assets/images/US_4_Highlight.png'
  }, {
    "id": 11,
    "title": "Partition the US - Part 4",
    "text": "Query the individual Area in Airbnb to see if all sites are available for scraping",
    "img": 'assets/images/US_5_Zoom.png'
  }, {
    "id": 12,
    "title": "Partition the US - Part 5",
    "text": "Over 1000+ Locations Listed, so zoom-in further and inspect size . . . ",
    "img": 'assets/images/Slide_C1_Large.png'
  }, {
    "id": 13,
    "title": "Partition the US - Part 6",
    "text": "Divide Area into 4 Equal Sections . . .",
    "img": 'assets/images/US_7_1_Divide.png'
  }, {
    "id": 14,
    "title": "Partition the US - Part 7",
    "text": "Search each section individually and repeat the division process if necessary  . . .",
    "img": 'assets/images/US_7_2_Divide_Highlight.png'
  }, {
    "id": 15,
    "title": "Partition the US - Part 8",
    "text": "Again, Over 1000+ Locations Listed, so zoom-in further and inspect size",
    "img": 'assets/images/Slide_C1_Large.png'
  }, {
    "id": 16,
    "title": "Partition the US - Part 9",
    "text": "Divide and Inspect",
    "img": 'assets/images/US_7_3_Divide_Again.png'
  }, {
    "id": 17,
    "title": "Partition the US - Part 10",
    "text": "Continue this Scheme unitl the entire area is Partitioned Accuratly",
    "img": 'assets/images/US_7_4_Divide_Again_and_Again.png'
  }, {
    "id": 18,
    "title": "Partition the US - Part 11",
    "text": "Once We have partitioned the area into 'Scrapable' Areas, Scrape!",
    "img": 'assets/images/US_7_5_Scrape.png'
  } ],

  setup: function() {
    var tiles = this.get('tutorialTiles');
    this.set('tile', tiles[this.get('currentImageIdx')]);
  }.on('didInsertElement'),

  actions: {
    left: function() {
      var numImages = this.get('tutorialTiles').length;
      var currentIdx = this.get('currentImageIdx');
      var nextIdx;
      if(currentIdx === 0) {
        nextIdx = numImages - 1;
      } else {
        nextIdx = currentIdx - 1;
      }
      this.set('currentImageIdx', nextIdx);
      this.set('tile', this.get('tutorialTiles')[nextIdx]);
    },
    right: function() {
      var numImages = this.get('tutorialTiles').length;
      var currentIdx = this.get('currentImageIdx');
      var nextIdx;
      if(currentIdx === numImages - 1) {
        nextIdx = 0;
      } else {
        nextIdx = currentIdx + 1;
      }
      this.set('currentImageIdx', nextIdx);
      this.set('tile', this.get('tutorialTiles')[nextIdx]);
    }
  }

});
