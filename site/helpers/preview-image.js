module.exports = function (url, classes) {

    var formatUrl = function (url, title) {
        title = title ? ' title="' + title + '"' : '';
        return '<a class="' + classes + '"' + ' href="' + url + '"' + title + ' target="_blank"></a>';
    }

    if (typeof url.href === 'string') {
        return formatUrl(url.href, url.title);
    }

    return url.href.map(function (u, idx) {
        var title = url.title ? url.title[idx] : '';
        return formatUrl(u, title);
    }).join('\n');

};
