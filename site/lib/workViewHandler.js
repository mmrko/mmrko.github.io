var helpers = require('./helpers');

function WorkViewHandler () {

    this.views = {};
    this.$activeView = null;
    this.$selectedTab = null;

}

function changeWorkView (event) {

    var $clickedTab = event.target;

    if ($clickedTab === this.$selectedTab) {
        console.log('Tab already selected');
        return false;
    }

    this.setSelectedTab($clickedTab);

    var viewName = $clickedTab.getAttribute('data-work-view-href');
    var view = this.views[viewName];

    if (view.$view === this.$activeView) {
        console.log('View already active');
        return false;
    }

    view.$view.classList.add('active');
    this.$activeView.classList.remove('active');
    this.$activeView = view.$view;

}

function changeWorkSubView (name, event) {

    var $clickedSubViewLink = event.target;

    if (!$clickedSubViewLink.classList.contains('work-view-links-subview-item')) {
        return false;
    }

    var view = this.views[name];

    if (view.$selectedSubViewLink) {
        view.$selectedSubViewLink.classList.remove('selected');
    }

    if (view.$activeSubView) {
        view.$activeSubView.classList.remove('active');
    }

    if ($clickedSubViewLink === view.$selectedSubViewLink) {
        view.$selectedSubViewLink = null;
        view.$activeSubView = null;
        return;
    }

    var index = Array.prototype.indexOf.call(view.subViewLinks, $clickedSubViewLink);

    view.$selectedSubViewLink = view.subViewLinks[index];
    view.$activeSubView = view.subViews[index];

    view.$selectedSubViewLink.classList.add('selected');
    view.$activeSubView.classList.add('active');

}

WorkViewHandler.prototype.getViewName = function ($view) {
    return $view.getAttribute('data-work-view-name');
};

WorkViewHandler.prototype.init = function ($container) {

    var $views = [];
    var $viewNav, view, viewName, viewChildElems, i, length;

    $container = $container || document.getElementById('js-work-view-nav');

    Array.prototype.forEach.call($container.children, function ($child) {
        if ($child.classList.contains('work-view-nav')) {
            $viewNav = $child;
        }
        else if ($child.classList.contains('work-view')) {
            $views.push($child);
        }
    });

    Array.prototype.forEach.call($views, function ($view, idx) {

        view = {};
        viewChildElems = $view.children;
        viewName = this.getViewName($view);

        for (i = 0, length = viewChildElems.length; i < length; i++) {

            if (viewChildElems[i].classList.contains('work-view-links-subview')) {
                view.subViewLinks = viewChildElems[i].children;
                view.$selectedSubViewLink = helpers.getNodeListItemByClassName(view.subViewLinks, 'selected')[0];
            }

            if (viewChildElems[i].classList.contains('work-view-subview')) {
                view.subViews = viewChildElems[i].children;
                view.$activeSubView = helpers.getNodeListItemByClassName(view.subViews, 'active')[0];
            }

        }

        if ($view.classList.contains('active')) {
            this.$activeView = $view;
        }

        view.$view = $view;

        this.views[viewName] = view;

        $view.addEventListener('click', changeWorkSubView.bind(this, viewName), false);

    }.bind(this));

    this.$selectedTab = $viewNav.getElementsByClassName('selected')[0];

    $viewNav.addEventListener('click', changeWorkView.bind(this), false);
};

WorkViewHandler.prototype.setSubView = function (view) {

};

WorkViewHandler.prototype.setSelectedTab = function ($tab) {
    $tab.classList.add('selected');
    this.$selectedTab.classList.remove('selected');
    this.$selectedTab = $tab;
};

module.exports = new WorkViewHandler();
