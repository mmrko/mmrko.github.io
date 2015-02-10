module.exports = {

    // Records a virtual pageview
    recordPageView: function (page, title) {

        if (page && window.ga) {
            console.debug('Sending ga pageview for page:', page);
            window.ga('send', 'pageview', {
                'page': [ '/#', page ].join(''),
                'title': title || document.title
            });
        }

    }

};
