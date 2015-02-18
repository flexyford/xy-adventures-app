define('xy-adventures-app/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].ActiveModelAdapter.extend({
    host: "http://api-bnb.herokuapp.com",
    //host: 'http://localhost:3000',
    headers: {
      Accept: "application/json, text/html, text/javascript"
    }
  });

});
define('xy-adventures-app/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'xy-adventures-app/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('xy-adventures-app/components/about-section', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: ["div"],
    classNames: ["about-section"],

    attributeBindings: ["anchor:id"],

    anchor: "about",

    aboutTiles: [{
      id: 1,
      text: "Plan Your Route",
      img: "assets/images/map41.png",
      attrId: "step-icon"
    }, {
      id: 2,
      text: "Find Airbnbs",
      img: "assets/images/map46.png",
      attrId: "step-icon"
    }, {
      id: 3,
      text: "Start Exploring",
      img: "assets/images/nature1.png",
      attrId: "step-icon"
    }]
  });

});
define('xy-adventures-app/components/anchor-link', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: "a",

    attributeBindings: ["hrefAnchorTag:href", "customModal:data-reveal-id", "id"],


    customModal: (function () {
      var customModal = this.get("modal");
      return customModal ? customModal : null;
    }).property("modal"),

    hrefAnchorTag: (function () {
      var customHref = this.get("customHref");
      return customHref ? "#" + customHref : "#";
    }).property("customHref")

  });

});
define('xy-adventures-app/components/fixed-nav-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: "nav",
    classNames: ["fixed-nav-bar"],

    didInsertElement: function () {
      this.$().foundation(); //or Ember.$(document).foundation();
    }
  });

});
define('xy-adventures-app/components/hero-wrapper', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: "div",
    classNames: ["hero-words"],

    baseImageUrl: "assets/images",

    heroImage: true,

    heroButtons: [{
      id: 1,
      "class": "button radius",
      attrId: "hero-button1",
      content: "Plan Your Trip",
      "link-to": "sites"
    }, {
      id: 2,
      "class": "button radius",
      attrId: "hero-button2",
      content: "How It Works",
      "anchor-to": "about"
    }],

    heroUrl: (function () {
      return this.get("baseImageUrl") + "/xy_nav_clear_diamond.png";
    }).property("baseImageUrl")

  });

});
define('xy-adventures-app/components/map-container', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["map"],

    map: {},

    waypoints: null,

    route: null,

    range: null,

    mySites: null,

    setup: (function () {
      L.mapbox.accessToken = "pk.eyJ1IjoiYWZvcmQiLCJhIjoiZ2RNeFNBMCJ9.Cv94HqHAWfhIuE6vx7QMlw";
      var map = L.mapbox.map("map", "aford.l4a1dfc2");
      this.set("map", map);
      this.set("range", 5);
    }).on("didInsertElement"),

    dropMarkers: (function () {
      var sites = this.get("mySites");
      var map = this.get("map");
      var geojson = { type: "FeatureCollection", features: [] };

      if (sites.length > 0) {
        // Build All Pin Markers for this new layer
        // var markers = [];
        sites.forEach(function (site) {
          var lat = parseFloat(site.get("latitude"));
          var lng = parseFloat(site.get("longitude"));
          var description = site.get("meta").location;
          var img = site.get("meta").imgUrl;
          var url = site.get("url");
          var title_str = site.get("name") + " - $" + site.get("price");


          geojson.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [lng, lat]
            },
            properties: {
              title: title_str,
              description: description,
              image: img,
              url: url,
              "marker-color": "#03A9F4"
            }
          });
        });

        var featureLayer = L.mapbox.featureLayer(geojson).addTo(map);
        featureLayer.eachLayer(function (layer) {
          // here you call `bindPopup` with a string of HTML you create - the feature
          // properties declared above are available under `layer.feature.properties`
          var content = "<a target=\"_blank\" class=\"popup\" href=\"" + layer.feature.properties.url + "\">" + "<p>" + layer.feature.properties.title + "</p>" + layer.feature.properties.description + "<img src=\"" + layer.feature.properties.image + "\" />" + "</a>";
          layer.bindPopup(content);
        });

        this.removeLayer();
        this.set("layer", featureLayer);
        map.fitBounds(featureLayer.getBounds());
      }

      console.log("Droping " + sites.length + " Sites!");
    }).observes("mySites.@each"),

    buildFeatureLayer: function (geojson) {
      var map = this.get("map");
      return;
    },

    removeLayer: function () {
      var currentLayer = this.get("layer");
      var map = this.get("map");
      if (currentLayer) {
        map.removeLayer(currentLayer);
      }
    },

    actions: {
      buildQuery: function () {
        var origin = this.get("start");
        var destination = this.get("end");
        console.log("start: " + origin + "\nend: " + destination);

        // THE BELOW IS EQUIVALENT BUT SLOWER
        var _this = this;

        // TODO - Build Route Using Mapbox Directions
        var accessToken = "pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q";
        var origin_req_url = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/" + origin + ".json?access_token=" + accessToken;
        var dest_req_url = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/" + destination + ".json?access_token=" + accessToken;

        var origin_coordinates;
        var destination_coordinates;

        // Request Origin Coordinates
        Ember['default'].$.when(Ember['default'].$.ajax({
          url: origin_req_url
        })).then(function (result) {
          // alert('Requested Waypoints for ' + origin + '!');
          origin_coordinates = result.features[0].center.join();
          // Request Destination Coordinates
          Ember['default'].$.when(Ember['default'].$.ajax({
            url: dest_req_url
          })).then(function (result) {
            // alert('Requested Waypoints for ' + destination + '!');
            destination_coordinates = result.features[0].center.join();
            // Request Waypoints along route
            var route_url = "http://api.tiles.mapbox.com/v4/directions/mapbox.driving/" + origin_coordinates + ";" + destination_coordinates + ".json?access_token=" + accessToken;

            Ember['default'].$.when(Ember['default'].$.ajax({
              url: route_url
            })).then(function (result) {
              _this.set("route", result);
              alert("Requesting Waypoints for " + origin + " to " + destination + "!");
              var waypoints = result.routes[0].geometry.coordinates.map(function (item) {
                // Flip from [LNG,LAT] to [LAT,LNG]
                return [item[1], item[0]];
              });
              _this.set("waypoints", waypoints);
              var uriLen = encodeURIComponent(JSON.stringify(waypoints)).length;
              var mod = Math.ceil(uriLen / 2000);
              var filtered_waypoints = waypoints.filter(function (item, idx) {
                return idx % mod === 0;
              });

              _this.sendAction("search", { route: JSON.stringify(filtered_waypoints) });
            });
          });
        });
      } }
  });

});
define('xy-adventures-app/components/map-filter-bar', ['exports', 'ember', 'xy-adventures-app/overrides/textfield'], function (exports, Ember, TextField) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["filter-section"],

    attributeBindings: ["id"],

    isPopularToggled: false,

    dateRange: null,

    id: "filter-section",

    actions: {}
    // Austin -97.7431,30.2671;-97.9414,29.883

  });

});
define('xy-adventures-app/components/map-filter-left', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: ["div"],
    attributeBindings: ["id"],
    classNames: ["map-container"],

    isDisplayed: false,

    didInsertElement: function () {
      this.$().foundation(); //or Ember.$(document).foundation();
    }

  });

});
define('xy-adventures-app/components/tutorial-section', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: ["div"],
    classNames: ["tutorial-section"],

    attributeBindings: ["anchor:id"],

    anchor: "tutorial",

    currentImageIdx: 0,

    tutorialTiles: [{
      id: 1,
      title: "XY-Adventures is Built On an Airbnb Web Scraper",
      text: "Vero migas biodiesel aliqua, meditation authentic Intelligentsia. Enim consequat photo booth crucifix flannel, umami yr sapiente reprehenderit readymade chia selvage officia. Bitters actually enim, kogi blog eiusmod et shabby chic excepteur forage pour-over mollit PBR&B nesciunt. Post-ironic nostrud Godard pug mollit, slow-carb semiotics brunch scenester minim pariatur nulla et master cleanse. Selvage migas bitters yr, put a bird on it consectetur direct trade assumenda trust fund. Flannel laborum 90's, scenester Pinterest sed cornhole pug. Adipisicing cornhole nostrud Truffaut cupidatat selfies.",
      img: "assets/images/airbnbmap.jpg"
    }, {
      id: 2,
      title: "What is Airbnb?",
      text: "Airbnb lets you rent unique places from local hosts in over 190 countries",
      img: "assets/images/Slide_A.png"
    }, {
      id: 3,
      title: "Search Techniques - Part 1 - Location Search",
      text: "Search by City State Zip",
      img: "assets/images/search.png"
    }, {
      id: 4,
      title: "Search Techniques - Part 2 - Coordinate Search",
      text: "Take a closer look . . . Search By Map +/- Buttons AND Latitude Longitude Coordinated in URL",
      img: "assets/images/search.png"
    }, {
      id: 5,
      title: "Search Techniques - Part 3 - Limits",
      text: "Airbnb sets limits on the amount of locations they share in a queried area: 18 Locations per page, Maximum of 56 Pages",
      img: "assets/images/Slide_C1_Large.png"
    }, {
      id: 6,
      title: "Search Techniques - Part 4 - Zoom",
      text: "Continue Zooming-In Until All locations within Coordinates are available . . . then begin scraping HTML.",
      img: "assets/images/Slide_C2_Large.png"
    }, {
      id: 7,
      title: "Search Techniques - Part 5 - The DOM",
      text: "Inspect the DOM Element for a location. Airbnb lists lat/lng coordinates in DOM meta-data. We now have enough information to start scraping!",
      img: "assets/images/Slide_D.png"
    }, {
      id: 8,
      title: "Partition the US",
      text: "What is the best way to split up scraping a large area without reaching Airbnb server limits?",
      img: "assets/images/Slide_0_Blank.png"
    }, {
      id: 9,
      title: "Partition the US - Part 2",
      text: "Split an area into smaller equal parts",
      img: "assets/images/US_3_Split.png"
    }, {
      id: 10,
      title: "Partition the US - Part 3",
      text: "Inspect A Random Area",
      img: "assets/images/US_4_Highlight.png"
    }, {
      id: 11,
      title: "Partition the US - Part 4",
      text: "Query the individual Area in Airbnb to see if all sites are available for scraping",
      img: "assets/images/US_5_Zoom.png"
    }, {
      id: 12,
      title: "Partition the US - Part 5",
      text: "Over 1000+ Locations Listed, so zoom-in further and inspect size . . . ",
      img: "assets/images/Slide_C1_Large.png"
    }, {
      id: 13,
      title: "Partition the US - Part 6",
      text: "Divide Area into 4 Equal Sections . . .",
      img: "assets/images/US_7_1_Divide.png"
    }, {
      id: 14,
      title: "Partition the US - Part 7",
      text: "Search each section individually and repeat the division process if necessary  . . .",
      img: "assets/images/US_7_2_Divide_Highlight.png"
    }, {
      id: 15,
      title: "Partition the US - Part 8",
      text: "Again, Over 1000+ Locations Listed, so zoom-in further and inspect size",
      img: "assets/images/Slide_C1_Large.png"
    }, {
      id: 16,
      title: "Partition the US - Part 9",
      text: "Divide and Inspect",
      img: "assets/images/US_7_3_Divide_Again.png"
    }, {
      id: 17,
      title: "Partition the US - Part 10",
      text: "Continue this Scheme unitl the entire area is Partitioned Accuratly",
      img: "assets/images/US_7_4_Divide_Again_and_Again.png"
    }, {
      id: 18,
      title: "Partition the US - Part 11",
      text: "Once We have partitioned the area into 'Scrapable' Areas, Scrape!",
      img: "assets/images/US_7_5_Scrape.png"
    }],

    setup: (function () {
      var tiles = this.get("tutorialTiles");
      this.set("tile", tiles[this.get("currentImageIdx")]);
    }).on("didInsertElement"),

    actions: {
      left: function () {
        var numImages = this.get("tutorialTiles").length;
        var currentIdx = this.get("currentImageIdx");
        var nextIdx;
        if (currentIdx === 0) {
          nextIdx = numImages - 1;
        } else {
          nextIdx = currentIdx - 1;
        }
        this.set("currentImageIdx", nextIdx);
        this.set("tile", this.get("tutorialTiles")[nextIdx]);
      },
      right: function () {
        var numImages = this.get("tutorialTiles").length;
        var currentIdx = this.get("currentImageIdx");
        var nextIdx;
        if (currentIdx === numImages - 1) {
          nextIdx = 0;
        } else {
          nextIdx = currentIdx + 1;
        }
        this.set("currentImageIdx", nextIdx);
        this.set("tile", this.get("tutorialTiles")[nextIdx]);
      }
    }

  });

});
define('xy-adventures-app/controllers/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({});

});
define('xy-adventures-app/controllers/sites', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({

    route: null,

    filteredSites: null,

    range: null,

    getDistanceFromLatLonInMi: function (lat1, lon1, lat2, lon2) {
      var R = 3963; // Radius of the earth in mi
      var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
      var dLon = this.deg2rad(lon2 - lon1);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in mi

      return d;
    },

    deg2rad: function (deg) {
      return deg * (Math.PI / 180);
    },

    // recalcSites: function() {
    //   Ember.run.once(this, 'buildSites');
    // }.observes('model.@each'),

    // This is happening Over and Over and Over again!
    buildSites: (function () {
      var filteredSites = this.get("model");
      var route = this.get("route");
      var range = this.get("range");
      var _this = this;
      filteredSites = filteredSites.filter(function (site) {
        var lat = parseFloat(site.get("latitude"));
        var long = parseFloat(site.get("longitude"));
        var found = route.reduce(function (withinBounds, point) {
          return withinBounds || range >= _this.getDistanceFromLatLonInMi(lat, long, point[0], point[1]);
        }, false);
        return found;
      });
      this.set("filteredSites", filteredSites);
      return filteredSites.length;
    }).observes("model") });

});
define('xy-adventures-app/initializers/app-version', ['exports', 'xy-adventures-app/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function (container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('xy-adventures-app/initializers/export-application-global', ['exports', 'ember', 'xy-adventures-app/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  };

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('xy-adventures-app/models/site', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    type: DS['default'].attr("string"),
    name: DS['default'].attr("string"),
    price: DS['default'].attr("number"),
    url: DS['default'].attr("string"),
    location: DS['default'].attr("string"),
    latitude: DS['default'].attr("number"),
    longitude: DS['default'].attr("number"),
    city: DS['default'].attr("string"),
    country: DS['default'].attr("string"),
    zipcode: DS['default'].attr("string"),
    address: DS['default'].attr("string"),
    meta: DS['default'].attr()
  });

});
define('xy-adventures-app/overrides/textfield', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].TextField.reopen({
    attributeBindings: ["data-toggle", "data-placement", "data-date-format", "placeholder"]
  });

});
define('xy-adventures-app/router', ['exports', 'ember', 'xy-adventures-app/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route("sites");
  });

  exports['default'] = Router;

});
define('xy-adventures-app/routes/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('xy-adventures-app/routes/sites', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      // this.store.pushPayload('site', data);
      return this.store.all("site");
    },

    actions: {
      search: function (query) {
        var store = this.store;
        // THE BELOW IS EQUIVALENT BUT SLOWER
        var _this = this;
        var controller = this.controllerFor("sites");

        store.find("site", query).then(function (result) {
          controller.get("model").forEach(function (site) {
            store.unloadRecord(site);
          });
          controller.set("model", result);
          alert("Success! Found Sites for " + query + "!");
        })["catch"](function () {
          alert("Failed to request Sites for " + query + "!");
        });
      }
    }
  });

});
define('xy-adventures-app/templates/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n\n \n");
    return buffer;
    
  });

});
define('xy-adventures-app/templates/components/about-section', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n   \n    <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":large-4 :columns :text-center")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" >\n      <p ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":ceil-text")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n        ");
    stack1 = helpers._triageMustache.call(depth0, "tile.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </p>\n     <img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("tile.img")
    },hashTypes:{'src': "STRING"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" ");
    data.buffer.push(escapeExpression((helper = helpers.bindAttr || (depth0 && depth0.bindAttr),options={hash:{
      'id': ("tile.attrId")
    },hashTypes:{'id': "STRING"},hashContexts:{'id': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bindAttr", options))));
    data.buffer.push(" />\n    \n    </div>\n  ");
    return buffer;
    }

    data.buffer.push("<!-- about section-->\n<div class=\"row\">\n  ");
    stack1 = helpers.each.call(depth0, "tile", "in", "aboutTiles", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>");
    return buffer;
    
  });

});
define('xy-adventures-app/templates/components/anchor-link', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('xy-adventures-app/templates/components/fixed-nav-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('xy-adventures-app/templates/components/hero-wrapper', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    ");
    stack1 = helpers['if'].call(depth0, "button.anchor-to", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(5, program5, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['anchor-link'] || (depth0 && depth0['anchor-link']),options={hash:{
      'customHref': ("button.anchor-to"),
      'class': ("button.class"),
      'id': ("button.attrId")
    },hashTypes:{'customHref': "ID",'class': "ID",'id': "ID"},hashContexts:{'customHref': depth0,'class': depth0,'id': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "anchor-link", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    return buffer;
    }
  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        ");
    stack1 = helpers._triageMustache.call(depth0, "button.content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      ");
    return buffer;
    }

  function program5(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("button.class"),
      'id': ("button.attrId")
    },hashTypes:{'class': "ID",'id': "ID"},hashContexts:{'class': depth0,'id': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "button.link-to", options) : helperMissing.call(depth0, "link-to", "button.link-to", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    return buffer;
    }

    data.buffer.push("<!--hero section-->\n<div id=\"hero-image\">\n  <div class=\"words\">\n   \n    <h1 ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":hero-title")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("> \n     X Y Adventures </h1>\n    <img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("heroUrl"),
      'class': (":hero-logo")
    },hashTypes:{'src': "ID",'class': "STRING"},hashContexts:{'src': depth0,'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("/>\n    <h3 ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":hero-text")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("> \n     Bike Some. Hike Some. Calc Sum. </h3>\n </div>\n\n<div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":hero-buttons")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n  ");
    stack1 = helpers.each.call(depth0, "button", "in", "heroButtons", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n </div>\n</div>\n\n  ");
    return buffer;
    
  });

});
define('xy-adventures-app/templates/components/map-container', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


    data.buffer.push("<!-- filter and search -->\n<div class=\"row\">\n  <div class=\"filter-row\">\n    <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":large-1 :columns")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" ></div>\n    <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":large-8 :columns")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n      <div class=\"panel\" id=\"search-panel\">\n        <li class=\"has-form\" id=\"search-row\">\n          <div class=\"row collapse\">\n            <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":large-4 :small-3 :columns")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n              ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("start"),
      'class': ("search"),
      'placeholder': ("Start Location")
    },hashTypes:{'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n            </div>\n            <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":large-4 :small-3 :columns")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n              ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("end"),
      'class': ("search"),
      'placeholder': ("End Location")
    },hashTypes:{'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n            </div>\n            <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":large-4 :small-3 :columns")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n              <button class=\"button small\" id=\"submit-button\" type=\"submit\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "buildQuery", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">Search</button>\n            </div>\n          </div>\n        </li>\n      </div>\n    </div>\n    <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":large-3 :columns")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n      <div class=\"panel\" id=\"switch-panel\">\n        <div class=\"switch\" id=\"numero1\">\n          ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'checked': ("isPopularToggled"),
      'id': ("exampleCheckboxSwitch"),
      'type': ("checkbox")
    },hashTypes:{'checked': "ID",'id': "STRING",'type': "STRING"},hashContexts:{'checked': depth0,'id': depth0,'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          <label for=\"exampleCheckboxSwitch\"></label>\n          <p class=\"switch-text\" id=\"switch-text2\">  Popular Events </p>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- mapbox -->\n<div id=\"map\"></div>\n\n");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('xy-adventures-app/templates/components/map-filter-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<!--map search, date, popular event toggle row-->\n");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('xy-adventures-app/templates/components/map-filter-left', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n          ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'checked': ("category.selected"),
      'id': ("category.name"),
      'type': ("checkbox"),
      'name': ("testGroup")
    },hashTypes:{'checked': "ID",'id': "ID",'type': "STRING",'name': "STRING"},hashContexts:{'checked': depth0,'id': depth0,'type': depth0,'name': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          <label for=");
    stack1 = helpers._triageMustache.call(depth0, "category.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("></label><br>\n        ");
    return buffer;
    }

    data.buffer.push("<!--map filter left-->\n\n<div class=\"row\">\n  <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":filter-left")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" >\n    <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":large-4 :columns")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" >\n      <div class=\"icon-bar large-vertical four-up\">\n \n    <a data-dropdown=\"drop2\" aria-controls=\"drop2\" aria-expanded=\"false\" class=\"item\" id=\"numero2\"> \n        <img src=\"assets/images/smallnew.png\" >\n          <label>Create</label>\n      </a>\n        \n      <div id=\"drop2\" data-dropdown-content class=\"f-dropdown content\" aria-hidden=\"true\" tabindex=\"-1\">\n          <form>\n            <div class=\"row\">\n              <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":large-12 :columns")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" >\n                  ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'placeholder': ("Austin, TX")
    },hashTypes:{'type': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n              </div>\n            </div>\n            <div class=\"row\">\n               <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":large-12 :columns")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" >\n                  ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'placeholder': ("Select Date")
    },hashTypes:{'type': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n              </div>\n            </div>\n            <div class=\"row\">\n               <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":large-12 :columns")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" >\n                  ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'placeholder': ("Select Event Type")
    },hashTypes:{'type': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n              </div>\n            </div>\n             <div class=\"row\">\n               <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":large-12 :columns")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" >\n                  ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'placeholder': ("Plan Name")
    },hashTypes:{'type': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n              </div>\n            </div>\n             <div class=\"row\">\n               <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":large-12 :columns")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" >\n                  ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'placeholder': ("Description")
    },hashTypes:{'type': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n              </div>\n            </div>\n            <div class=\"row\">\n               <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":large-12 :columns")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" >\n            <a href=\"#\" class=\"tiny button\"> Create Plan </a>  \n          </div>\n        </div>\n        </form>\n      </div> \n\n      <a data-dropdown=\"drop4\" aria-controls=\"drop4\" aria-expanded=\"false\" class=\"item\" id=\"numero3\"> \n        <img src=\"assets/images/smallfilter.png\" >\n          <label>Filter</label>\n      </a>\n        \n      <div id=\"drop4\" data-dropdown-content class=\"f-dropdown content\" aria-hidden=\"true\" tabindex=\"-1\">\n   \n        ");
    stack1 = helpers.each.call(depth0, "category", "in", "categories", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n     </div>\n\n      <!-- if click on this button, display joyride-->\n  \n      <a class=\"item\" id=\"info-button\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "joyRide", "start", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
    data.buffer.push(">\n        <img src=\"assets/images/smallinfo.png\">\n        <label>Info</label>\n      </a>\n\n      <a data-dropdown=\"drop3\" aria-controls=\"drop3\" aria-expanded=\"false\" class=\"item\" id=\"numero4\"> \n        <img src=\"assets/images/smallplan.png\" >\n          <label>Plans</label>\n      </a>\n        \n      <div id=\"drop3\" data-dropdown-content class=\"f-dropdown content\" aria-hidden=\"true\" tabindex=\"-1\">\n        \n      </div>\n    </div>\n  </div>\n</div>\n\n\n\n");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    return buffer;
    
  });

});
define('xy-adventures-app/templates/components/tutorial-section', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression;


    data.buffer.push("<!-- about section-->\n<div class=\"row\">\n  <div class=\"large-1 columns slide-prev \">\n    <img src=\"assets/images/left209.png\" alt=\"slide prev\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "left", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" />\n  </div>\n  <div class=\"large-10 columns text-center banner\">\n    <img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("tile.img")
    },hashTypes:{'src': "STRING"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("/>\n    <p class=\"ceil-text header\">");
    stack1 = helpers._triageMustache.call(depth0, "tile.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n    <p>");
    stack1 = helpers._triageMustache.call(depth0, "tile.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n  </div>\n  <div class=\"large-1 columns slide-next \">\n    <img src=\"assets/images/right230.png\" alt=\"slide next\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "right", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" />\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('xy-adventures-app/templates/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers['hero-wrapper'] || (depth0 && depth0['hero-wrapper']),options={hash:{
      'buttons': ("heroButtons")
    },hashTypes:{'buttons': "ID"},hashContexts:{'buttons': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "hero-wrapper", options))));
    data.buffer.push("\n<div class=\"row\">\n  <div class=\"large-12 columns\">\n    ");
    stack1 = helpers._triageMustache.call(depth0, "about-section", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    stack1 = helpers._triageMustache.call(depth0, "tutorial-section", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </div>\n</div>  \n");
    stack1 = helpers._triageMustache.call(depth0, "team-section", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('xy-adventures-app/templates/sites', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, functionType="function", blockHelperMissing=helpers.blockHelperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n  <div class=\"logo-section\"> \n\n    ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "index", options) : helperMissing.call(depth0, "link-to", "index", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n  </div>\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    
    data.buffer.push("\n      <img src=\"assets/images/xy_nav_clear_x_bike_power_blue.png\" \n      class=\"logo-image\"></img>\n    ");
    }

    options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}
    if (helper = helpers['fixed-nav-bar']) { stack1 = helper.call(depth0, options); }
    else { helper = (depth0 && depth0['fixed-nav-bar']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
    if (!helpers['fixed-nav-bar']) { stack1 = blockHelperMissing.call(depth0, 'fixed-nav-bar', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}); }
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<!-- Display Map -->\n<div class=\"row\" id=\"map-canvas\">\n  <!-- Display Top Horizantal Map Filters -->\n  <!-- | compAct = \"CtrlAct\" compAttr = CtrlAttr | -->\n  <div class=\"large-1 columns\">\n    <!-- Display Left Vertical Map Filters -->\n    ");
    data.buffer.push(escapeExpression((helper = helpers['map-filter-left'] || (depth0 && depth0['map-filter-left']),options={hash:{
      'categories': ("categories")
    },hashTypes:{'categories': "ID"},hashContexts:{'categories': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "map-filter-left", options))));
    data.buffer.push("\n  </div>\n  <div class=\"large-10 columns\">\n    <!-- Display Map -->\n    ");
    data.buffer.push(escapeExpression((helper = helpers['map-container'] || (depth0 && depth0['map-container']),options={hash:{
      'mySites': ("filteredSites"),
      'waypoints': ("route"),
      'range': ("range"),
      'search': ("search")
    },hashTypes:{'mySites': "ID",'waypoints': "ID",'range': "ID",'search': "STRING"},hashContexts:{'mySites': depth0,'waypoints': depth0,'range': depth0,'search': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "map-container", options))));
    data.buffer.push("\n  </div>\n  <div class=\"large-1 columns\">\n    <!-- Display Right Vertical Map Filters -->\n    ");
    stack1 = helpers._triageMustache.call(depth0, "map-filter-right", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('xy-adventures-app/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/components/about-section.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/about-section.js should pass jshint', function() { 
    ok(true, 'components/about-section.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/components/anchor-link.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/anchor-link.js should pass jshint', function() { 
    ok(true, 'components/anchor-link.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/components/fixed-nav-bar.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/fixed-nav-bar.js should pass jshint', function() { 
    ok(true, 'components/fixed-nav-bar.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/components/hero-wrapper.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/hero-wrapper.js should pass jshint', function() { 
    ok(true, 'components/hero-wrapper.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/components/map-container.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/map-container.js should pass jshint', function() { 
    ok(false, 'components/map-container.js should pass jshint.\ncomponents/map-container.js: line 21, col 25, Missing semicolon.\ncomponents/map-container.js: line 68, col 15, Missing semicolon.\ncomponents/map-container.js: line 140, col 78, Missing semicolon.\ncomponents/map-container.js: line 82, col 9, \'map\' is defined but never used.\ncomponents/map-container.js: line 81, col 31, \'geojson\' is defined but never used.\n\n5 errors'); 
  });

});
define('xy-adventures-app/tests/components/map-filter-bar.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/map-filter-bar.js should pass jshint', function() { 
    ok(false, 'components/map-filter-bar.js should pass jshint.\ncomponents/map-filter-bar.js: line 2, col 8, \'TextField\' is defined but never used.\n\n1 error'); 
  });

});
define('xy-adventures-app/tests/components/map-filter-left.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/map-filter-left.js should pass jshint', function() { 
    ok(true, 'components/map-filter-left.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/components/tutorial-section.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/tutorial-section.js should pass jshint', function() { 
    ok(true, 'components/tutorial-section.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/controllers/index.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/index.js should pass jshint', function() { 
    ok(true, 'controllers/index.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/controllers/sites.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/sites.js should pass jshint', function() { 
    ok(false, 'controllers/sites.js should pass jshint.\ncontrollers/sites.js: line 27, col 31, Missing semicolon.\ncontrollers/sites.js: line 45, col 82, Missing semicolon.\n\n2 errors'); 
  });

});
define('xy-adventures-app/tests/helpers/resolver', ['exports', 'ember/resolver', 'xy-adventures-app/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('xy-adventures-app/tests/helpers/start-app', ['exports', 'ember', 'xy-adventures-app/app', 'xy-adventures-app/router', 'xy-adventures-app/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('xy-adventures-app/tests/models/site.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/site.js should pass jshint', function() { 
    ok(true, 'models/site.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/overrides/textfield.jshint', function () {

  'use strict';

  module('JSHint - overrides');
  test('overrides/textfield.js should pass jshint', function() { 
    ok(true, 'overrides/textfield.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/routes/index.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/index.js should pass jshint', function() { 
    ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/routes/sites.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/sites.js should pass jshint', function() { 
    ok(false, 'routes/sites.js should pass jshint.\nroutes/sites.js: line 13, col 11, \'_this\' is defined but never used.\n\n1 error'); 
  });

});
define('xy-adventures-app/tests/test-helper', ['xy-adventures-app/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('xy-adventures-app/tests/unit/adapters/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("adapter:application", "ApplicationAdapter", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var adapter = this.subject();
    ok(adapter);
  });
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
define('xy-adventures-app/tests/unit/components/about-section-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("about-section", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('xy-adventures-app/tests/unit/components/anchor-link-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("anchor-link", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('xy-adventures-app/tests/unit/components/fixed-nav-bar-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("fixed-nav-bar", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('xy-adventures-app/tests/unit/components/hero-wrapper-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("hero-wrapper", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('xy-adventures-app/tests/unit/components/map-container-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("map-container", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('xy-adventures-app/tests/unit/components/map-filter-bar-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("map-filter-bar", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('xy-adventures-app/tests/unit/components/map-filter-left-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("map-filter-left", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('xy-adventures-app/tests/unit/components/tutorial-section-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("tutorial-section", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('xy-adventures-app/tests/unit/controllers/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:index", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('xy-adventures-app/tests/unit/controllers/sites-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:sites", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('xy-adventures-app/tests/unit/models/site-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("site", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('xy-adventures-app/tests/unit/routes/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:index", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('xy-adventures-app/tests/unit/routes/sites-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:sites", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('xy-adventures-app/tests/xy-adventures-app/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/helpers');
  test('xy-adventures-app/tests/helpers/resolver.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/helpers/resolver.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/helpers');
  test('xy-adventures-app/tests/helpers/start-app.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/helpers/start-app.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests');
  test('xy-adventures-app/tests/test-helper.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/test-helper.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/unit/adapters/application-test.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/unit/adapters');
  test('xy-adventures-app/tests/unit/adapters/application-test.js should pass jshint', function() { 
    ok(false, 'xy-adventures-app/tests/unit/adapters/application-test.js should pass jshint.\nxy-adventures-app/tests/unit/adapters/application-test.js: line 14, col 3, \'ok\' is not defined.\n\n1 error'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/unit/components/about-section-test.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/unit/components');
  test('xy-adventures-app/tests/unit/components/about-section-test.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/unit/components/about-section-test.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/unit/components/anchor-link-test.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/unit/components');
  test('xy-adventures-app/tests/unit/components/anchor-link-test.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/unit/components/anchor-link-test.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/unit/components/fixed-nav-bar-test.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/unit/components');
  test('xy-adventures-app/tests/unit/components/fixed-nav-bar-test.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/unit/components/fixed-nav-bar-test.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/unit/components/hero-wrapper-test.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/unit/components');
  test('xy-adventures-app/tests/unit/components/hero-wrapper-test.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/unit/components/hero-wrapper-test.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/unit/components/map-container-test.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/unit/components');
  test('xy-adventures-app/tests/unit/components/map-container-test.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/unit/components/map-container-test.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/unit/components/map-filter-bar-test.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/unit/components');
  test('xy-adventures-app/tests/unit/components/map-filter-bar-test.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/unit/components/map-filter-bar-test.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/unit/components/map-filter-left-test.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/unit/components');
  test('xy-adventures-app/tests/unit/components/map-filter-left-test.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/unit/components/map-filter-left-test.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/unit/components/tutorial-section-test.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/unit/components');
  test('xy-adventures-app/tests/unit/components/tutorial-section-test.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/unit/components/tutorial-section-test.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/unit/controllers/index-test.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/unit/controllers');
  test('xy-adventures-app/tests/unit/controllers/index-test.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/unit/controllers/index-test.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/unit/controllers/sites-test.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/unit/controllers');
  test('xy-adventures-app/tests/unit/controllers/sites-test.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/unit/controllers/sites-test.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/unit/models/site-test.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/unit/models');
  test('xy-adventures-app/tests/unit/models/site-test.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/unit/models/site-test.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/unit/routes/index-test.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/unit/routes');
  test('xy-adventures-app/tests/unit/routes/index-test.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/unit/routes/index-test.js should pass jshint.'); 
  });

});
define('xy-adventures-app/tests/xy-adventures-app/tests/unit/routes/sites-test.jshint', function () {

  'use strict';

  module('JSHint - xy-adventures-app/tests/unit/routes');
  test('xy-adventures-app/tests/unit/routes/sites-test.js should pass jshint', function() { 
    ok(true, 'xy-adventures-app/tests/unit/routes/sites-test.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

define('xy-adventures-app/config/environment', ['ember'], function(Ember) {
  var prefix = 'xy-adventures-app';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("xy-adventures-app/tests/test-helper");
} else {
  require("xy-adventures-app/app")["default"].create({"name":"xy-adventures-app","version":"0.0.0.5236fc4b"});
}

/* jshint ignore:end */
//# sourceMappingURL=xy-adventures-app.map