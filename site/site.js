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

var faceAnimations = (function () {

    var animations = {
        CLOCKWISE: 'animation-face-clockwise',
        COUNTERCLOCKWISE: 'animation-face-counter-clockwise',
        FADE: 'animation-face-fade'
    };

    var values = [];

    Object.keys(animations).forEach(function (animation) {
        values.push(animations[animation]);
    });

    animations.values = values;

    return animations;
})();


var intro = (function (element) {

    var removed = false;

    return {
        remove: function () {
            if (!removed) {
                element.classList.add('animation-intro-end');
                removed = true;
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

function animationEvent(element, type, callback) {
    for (var p = 0; p < pfx.length; p++) {
        if (!pfx[p]) type = type.toLowerCase();
        element.addEventListener(pfx[p]+type, callback, false);
    }
}

function resetBgSecondary () {
    console.log('transitioned!');
    bgSecondaryElem.className = bgPrimaryElem.className;
    setTimeout(function () {
        bgSecondaryElem.classList.add('background-transition');
    }, 0);
}

function changeBackground (nextState) {
    bgPrimaryElem.className = [ 'background', 'background-state-' + nextState ].join(' ');
    bgSecondaryElem.classList.add('background-hide');
    bgSecondaryElem.addEventListener('transitionend', resetBgSecondary, false);
}

function resetFaces (animation, event) {
    facePrimaryElem.classList.remove(animation);
    faceSecondaryElem.className = facePrimaryElem.className.replace('face-primary', 'face-secondary');
}

function changeFace (nextState, stateAnimation) {

    facePrimaryElem.className = facePrimaryElem.className.replace(/face\-state-\w+/i, [ 'face-state', nextState ].join('-'));

    facePrimaryElem.classList.add(stateAnimation);
    faceSecondaryElem.classList.add(stateAnimation);

    animationEvent(faceSecondaryElem, 'AnimationEnd', resetFaces.bind(null, stateAnimation));
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

    var direction = faceAnimations.FADE;

    if (nextState === 'about') {
        socialLinksElem.classList.add('right-handed');
        siteLinksElem.classList.add('right-handed');
        direction = faceAnimations.COUNTERCLOCKWISE
    }
    else {
        socialLinksElem.classList.remove('right-handed');
        siteLinksElem.classList.remove('right-handed');
    }

    if (currentState === 'about') {
        direction = faceAnimations.CLOCKWISE;
    }

    changeFace(nextState, direction);

    changeNavbarItem(currentState, nextState);

}

function changeState (currentState, nextState) {

    if (currentState === nextState) {
        return false;
    }

    console.log('States:', currentState, '->', nextState)

    changeBackground(nextState);

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

if (window.location.hash && window.location.hash !== 'home') {
    changeState('home', window.location.hash.replace('#', ''));
}

window.addEventListener('hashchange', onHashChange, false);
