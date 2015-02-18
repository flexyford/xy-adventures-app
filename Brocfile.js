/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var pickFiles = require('broccoli-static-compiler');

var app = new EmberApp({
    'ember-cli-foundation-sass': {
    'modernizr': true,
    'fastclick': true,
    'foundationJs': ['tab', 'topbar', 'orbit', 'dropdown', 'joyride', 'reveal']
  }
});

// Use `app.import` to add additional libraries to the generated
// output files.

app.import('bower_components/mapbox.js/mapbox.js', {
   exports: {
     'mapBox.js': [
       'L'
     ]
   }
});

app.import("bower_components/mapbox.js/mapbox.css");

var extraAssets = pickFiles('bower_components/mapbox.js/images', {
  srcDir: '/',
  files: ['icons-*', 'layers-*', 'marker-*'],
  destDir: '/assets/images'
});

app.options.inlineContent = {
  "googleFonts": "vendor/googleFonts.html"
}

// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

module.exports = app.toTree(extraAssets);

