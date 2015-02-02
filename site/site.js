var workViewHandler = require('./workViewHandler');

var bgPrimaryElem = document.getElementById('js-background-primary');
var bgSecondaryElem = document.getElementById('js-background-secondary');
var bannerElem = document.getElementById('js-banner');
var socialLinksElem = document.getElementById('js-social')
var siteLinksElem = document.getElementById('js-site-links')
var facePrimaryElem = document.getElementById('js-face-primary');
var faceSecondaryElem = document.getElementById('js-face-secondary');
var introElem = document.getElementById('js-intro');
var navBarElems = document.getElementsByClassName('navbar-item');
var pfx = ['webkit', 'moz', 'MS', 'o', ''];

var faceAnimations = {
    CLOCKWISE: 'animation-face-clockwise',
    COUNTERCLOCKWISE: 'animation-face-counter-clockwise',
    FADE: 'animation-face-fade',
    findAnimationClass: function (elem) {
        var match = /animation\-face\-\S*/.exec(elem.className);
        return match ? match[0] : '';
    }
};

var intro = (function (element) {

    var removed = false;

    var removeFromDom = function () {
        element.parentNode.removeChild(element);
        animationEvent(element, 'AnimationEnd', removeFromDom, true);
    };

    animationEvent(element, 'AnimationEnd', removeFromDom);

    return {
        remove: function () {
            if (!removed) {
                removed = true;
                element.classList.add('animation-intro-end');
            }
        }
    }

})(introElem);

var bannerDown = bannerElem.classList.add.bind(bannerElem.classList, 'banner-down');
var bannerUp = bannerElem.classList.remove.bind(bannerElem.classList, 'banner-down')

var bannerToggler = (function BannerToggler (initialState, downCb, upCb) {

    var toggleState = initialState;

    return {
        toggle: function (toggle) {
            if (toggle !== toggleState) {
                console.log('Toggling!');
                toggle === 'down' ? downCb() : upCb();
                toggleState = toggle;
            }
        }
    };

})('up', bannerDown, bannerUp);

function animationEvent(element, type, callback, remove) {
    for (var p = 0; p < pfx.length; p++) {
        if (!pfx[p]) type = type.toLowerCase();
        remove ? element.removeEventListener(pfx[p]+type, callback) : element.addEventListener(pfx[p]+type, callback, false);
    }
}

function resetBgSecondary () {
    console.log('Resetting background...');

    // TODO: Triggers a document wide layout, hrr. Should use classList API here instead.
    bgSecondaryElem.className = bgPrimaryElem.className;

    setTimeout(function () {
        bgSecondaryElem.classList.add('background-transition');
    }, 0);

}

function resetFaces () {
    console.log('Changing face...')
    var faceAnimation = faceAnimations.findAnimationClass(facePrimaryElem);
    facePrimaryElem.classList.remove(faceAnimation);
    // TODO: Triggers a layout, hrr. Should use classList API here instead.
    faceSecondaryElem.className = facePrimaryElem.className.replace('face-primary', 'face-secondary');
}

function changeBackground (currentState, nextState) {
    bgPrimaryElem.classList.remove('background-state-' + currentState);
    bgPrimaryElem.classList.add('background-state-' + nextState);
    bgSecondaryElem.classList.add('background-hide');
}

function changeFace (currentState, nextState, faceAnimation) {
    facePrimaryElem.classList.remove('face-state-' + currentState);
    facePrimaryElem.classList.add('face-state-' + nextState);
    facePrimaryElem.classList.add(faceAnimation);
    faceSecondaryElem.classList.add(faceAnimation);

}

function changeNavbarItem (currentState, nextState) {

    var i, length, navbarElem;

    for (i = 0, length = navBarElems.length; i < length; i++) {
        navbarElem = navBarElems[i];
        navbarElem.classList.add([ 'navbar-item-bg-state', nextState ].join('-'));
        navbarElem.classList.remove([ 'navbar-item-bg-state', currentState ].join('-'));
    }

}

function animateNavbar (currentState, nextState) {

    var faceAnimation = faceAnimations.FADE;

    if (nextState === 'about') {
        socialLinksElem.classList.add('right-handed');
        siteLinksElem.classList.add('right-handed');
        faceAnimation = faceAnimations.COUNTERCLOCKWISE
    }
    else {
        socialLinksElem.classList.remove('right-handed');
        siteLinksElem.classList.remove('right-handed');
    }

    if (currentState === 'about') {
        faceAnimation = faceAnimations.CLOCKWISE;
    }

    changeFace(currentState, nextState, faceAnimation);

    changeNavbarItem(currentState, nextState);

}

function changeState (currentState, nextState) {

    if (!nextState || currentState === nextState) {
        return false;
    }

    console.log('States:', currentState, '->', nextState)

    changeBackground(currentState, nextState);

    animateNavbar(currentState, nextState);

    if (nextState !== 'home') {
        intro.remove();
        bannerToggler.toggle('down');
    }
    else {
        bannerToggler.toggle('up');
    }

}

function onHashChange (event) {
    var stateRegExp = /\/#(.+)/;
    var currentState = stateRegExp.exec(event.oldURL);
    var nextState = stateRegExp.exec(event.newURL);

    currentState = currentState ? currentState[1] : 'home';
    nextState = nextState ? nextState[1] : 'home';

    changeState(currentState, nextState);
}

workViewHandler.init();

bgSecondaryElem.addEventListener('transitionend', resetBgSecondary, false);
animationEvent(faceSecondaryElem, 'AnimationEnd', resetFaces);
window.addEventListener('hashchange', onHashChange, false);

if (window.location.hash && window.location.hash !== 'home') {
    setTimeout(function () {
        changeState('home', window.location.hash.replace('#', ''));
    }, 0);
}
