var autoprefixer = require('broccoli-autoprefixer');

var Site = require('broccoli-taco');
var site = new Site();

var tree = site.toTree();

if (process.env.BROCCOLI_TACO_ENV === 'production') {
    console.log('Building for production...');
    tree = require('broccoli-strip-debug')(tree);
}

tree = autoprefixer(tree);

module.exports = tree;

