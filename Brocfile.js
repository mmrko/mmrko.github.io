var autoprefixer = require('broccoli-autoprefixer');

var Site = require('broccoli-taco');
var site = new Site();

var tree = site.toTree();

tree = autoprefixer(tree);

module.exports = tree;

