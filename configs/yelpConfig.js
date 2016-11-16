var Yelp = require('yelp');
var yelpConfig = require('./auth').yelp;

module.exports = new Yelp(yelpConfig);