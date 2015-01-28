var autoprefixer = require('broccoli-autoprefixer');
// var imagemin = require('broccoli-imagemin');

var Site = require('broccoli-taco');
var site = new Site();

var tree = site.toTree();

if (process.env.BROCCOLI_TACO_ENV === 'production') {
    // var options = {
    //     interlaced: true,
    //     optimizationLevel: 3,
    //     progressive: true,
    //     lossyPNG: false
    // };
    // tree = imagemin(tree);
}

tree = autoprefixer(tree);

module.exports = tree;

