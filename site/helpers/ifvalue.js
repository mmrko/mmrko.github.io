module.exports = function (conditional, options) {
    if (conditional === options.hash.equals) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}
