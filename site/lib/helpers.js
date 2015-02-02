var helpers = {};

helpers.getNodeListItemByClassName = function (nodeList, className) {

    var elems = [];
    var i, length;

    for (i = 0, length = nodeList.length; i < length; i++) {

        if (nodeList[i].classList.contains(className)) {
            elems.push(nodeList[i]);
        }
    }

    return elems;

};

module.exports = helpers;
