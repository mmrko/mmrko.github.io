var workViewHandler = require('./workViewHandler');
var animation = require('./CSSAnimations');
var bgPrimaryElem = document.getElementById('js-background-primary');
var bgSecondaryElem = document.getElementById('js-background-secondary');
var bannerElem = document.getElementById('js-banner');
var socialLinksElem = document.getElementById('js-social')
var siteLinksElem = document.getElementById('js-site-links')
var facePrimaryElem = document.getElementById('js-face-primary');
var faceSecondaryElem = document.getElementById('js-face-secondary');
var introElem = document.getElementById('js-intro');
var navBarElems = document.getElementsByClassName('navbar-item');

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
        element.removeEventListener(animation.end, removeFromDom);
    };

    element.addEventListener(animation.end, removeFromDom, false);

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

function transitionEndEventName () {
    var i,
        undefined,
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

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

workViewHandler.init();

bgSecondaryElem.addEventListener(transitionEndEventName(), resetBgSecondary, false);

if (animation.supported) {
    faceSecondaryElem.addEventListener(animation.end, resetFaces, false);
}
else {
    console.warn('CSS Animations not supported!');
}

if (window.location.hash && window.location.hash !== 'home') {
    setTimeout(function () {
        changeState('home', window.location.hash.replace('#', ''));
    }, 0);
}

if (!('onhashchange' in window) || window.attachEvent) {
    prev = window.location.href;
    setInterval(function() {
        next = window.location.href;
        if (prev === next) return;
        onHashChange.call(window, {
            type: 'hashchange',
            newURL: next,
            oldURL: prev
        });
        prev = next;
    }, 100);
} else if (window.addEventListener) {
    window.addEventListener('hashchange', onHashChange, false);
}