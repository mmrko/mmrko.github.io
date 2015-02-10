require('./lib/workViewHandler').init();
var analyticsRecorder = require('./lib/analyticsRecorder');
var animation = require('./lib/CSSAnimations');

var bgPrimaryElem = document.getElementById('js-background-primary');
var bgSecondaryElem = document.getElementById('js-background-secondary');
var bannerElem = document.getElementById('js-banner');
var socialLinksElem = document.getElementById('js-social');
var siteLinksElem = document.getElementById('js-site-links');
var faceContainerElem = document.getElementById('js-face');
var facePrimaryElem = document.getElementById('js-face-primary');
var faceSecondaryElem = document.getElementById('js-face-secondary');
var navBarElems = document.getElementsByClassName('navbar-item');

var faceImages = new Image();

var bannerDown = bannerElem.classList.add.bind(bannerElem.classList, 'banner-down');
var bannerUp = bannerElem.classList.remove.bind(bannerElem.classList, 'banner-down');

var faceAnimations = {
    CLOCKWISE: 'animation-face-clockwise',
    COUNTERCLOCKWISE: 'animation-face-counter-clockwise',
    FADE: 'animation-face-fade',
    findAnimationClass: function (elem) {
        var match = /animation\-face\-\S*/.exec(elem.className);
        return match ? match[0] : '';
    }
};

var bannerToggler = (function BannerToggler (initialState, downCb, upCb) {

    var toggleState = initialState;

    return {
        toggle: function (toggle) {
            if (toggle !== toggleState) {

                console.log('Toggling!');

                toggleState = toggle;

                if (toggle === 'down') {
                    downCb();
                }
                else {
                    upCb();
                }

            }
        }
    };

})('up', bannerDown, bannerUp);

var stateManager = (function (window) {

    var prevState = 'home',
        currentState = window.location.hash.replace('#', ''),
        urlHashRegex = /\/#(.+)/,
        changedOnInit = false;

    currentState = currentState || 'home';

    if (prevState !== currentState) {
        changedOnInit = true;
    }

    function isValidState (state) {
        return [ 'home', 'about', 'work' ].indexOf(state) !== -1;
    }

    function handleStateChange (callback, event) {

        if (event && event.newUrl) {
            currentState = urlHashRegex.exec(event.newURL);
            currentState = currentState ? currentState[1] : 'home';
        }
        else {
            currentState = window.location.hash.replace('#', '');
            currentState = currentState || 'home';
        }

        if (currentState === prevState) {
            return console.info('State not changed.');
        }

        if (!isValidState(currentState)) {
            return console.error('Invalid state: ', currentState);
        }

        callback.apply(event, [ prevState, currentState ]);

    }

    return {
        onStateChange: function (func) {

            if (!func || typeof func !== 'function') {
                return console.error('Callback argment is not a function.');
            }

            var hashChanged = function (prev, next) {
                console.info('Changing state:', prev, '->', next);
                func.apply(this, [ prev, next ]);
                prevState = next;
            };

            var handlerFunc = handleStateChange.bind(null, hashChanged);

            if (changedOnInit) {
                setTimeout(handlerFunc, 0);
                changedOnInit = false;
            }

            return window.addEventListener('hashchange', handlerFunc, false);
        }
    };

})(window);

function transitionEndEventName () {
    var i,
        el = document.createElement('div'),
        transitions = {
            'transition':'transitionend',
            'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

    for (i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
        }
    }

    //TODO: throw 'TransitionEnd event is not supported in this browser';
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
    console.log('Changing face...');
    var faceAnimation = faceAnimations.findAnimationClass(facePrimaryElem);
    facePrimaryElem.classList.remove(faceAnimation);
    // TODO: Triggers a layout, hrr. Should use classList API here instead.
    faceSecondaryElem.className = facePrimaryElem.className.replace('face-primary', 'face-secondary');
}

function changeBackground (prevState, currentState) {
    bgPrimaryElem.classList.remove('background-state-' + prevState);
    bgPrimaryElem.classList.add('background-state-' + currentState);
    bgSecondaryElem.classList.add('background-hide');
}

function changeFace (prevState, currentState, faceAnimation) {
    facePrimaryElem.classList.remove('face-state-' + prevState);
    facePrimaryElem.classList.add('face-state-' + currentState);
    facePrimaryElem.classList.add(faceAnimation);
    faceSecondaryElem.classList.add(faceAnimation);

}

function changeNavbarItem (prevState, currentState) {

    var i, length, navbarElem;

    for (i = 0, length = navBarElems.length; i < length; i++) {
        navbarElem = navBarElems[i];
        navbarElem.classList.add([ 'navbar-item-bg-state', currentState ].join('-'));
        navbarElem.classList.remove([ 'navbar-item-bg-state', prevState ].join('-'));
    }

}

function animateNavbar (prevState, currentState) {

    var faceAnimation = faceAnimations.FADE;

    if (currentState === 'about') {
        socialLinksElem.classList.add('right-handed');
        siteLinksElem.classList.add('right-handed');
        faceAnimation = faceAnimations.COUNTERCLOCKWISE;
    }
    else {
        socialLinksElem.classList.remove('right-handed');
        siteLinksElem.classList.remove('right-handed');
    }

    if (prevState === 'about') {
        faceAnimation = faceAnimations.CLOCKWISE;
    }

    changeFace(prevState, currentState, faceAnimation);

    changeNavbarItem(prevState, currentState);

}

function changeState (prevState, currentState) {

    changeBackground(prevState, currentState);

    animateNavbar(prevState, currentState);

    if (currentState !== 'home') {
        bannerToggler.toggle('down');
    }
    else {
        bannerToggler.toggle('up');
    }

    analyticsRecorder.recordPageView(currentState);

}

if (animation.supported) {
    faceSecondaryElem.addEventListener(animation.end, resetFaces, false);
}
else {
    console.warn('CSS Animations not supported!');
}

bgSecondaryElem.addEventListener(transitionEndEventName(), resetBgSecondary, false);

stateManager.onStateChange(changeState);

faceImages.onload = function (event) {

    var i, length;

    faceContainerElem.classList.add('face-container-animation');

    for (i = 0, length = navBarElems.length; i < length; i++) {
        navBarElems[i].classList.add('navbar-item-animation');
    }

};

faceImages.src = 'static/images/faces.png';
