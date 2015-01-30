var bgPrimaryElem = document.getElementById('js-background-primary');
var bgSecondaryElem = document.getElementById('js-background-secondary');
var bannerElem = document.getElementById('js-banner');
var socialLinksElem = document.getElementById('js-social')
var siteLinksElem = document.getElementById('js-site-links')
var facePrimaryElem = document.getElementById('js-face-primary');
var faceSecondaryElem = document.getElementById('js-face-secondary');
var introElem = document.getElementById('js-intro');
var navBarWork = document.getElementById('js-navigation-work');
var navBarWorkItemElems = document.getElementsByClassName('navigation-work-item');
var navBarElems = document.getElementsByClassName('navbar-item');
var pfx = ['webkit', 'moz', 'MS', 'o', ''];

var faceAnimations = {
    CLOCKWISE: 'animation-face-clockwise',
    COUNTERCLOCKWISE: 'animation-face-counter-clockwise',
    FADE: 'animation-face-fade'
};

var intro = (function (element) {

    var removed = false;

    var removeFromDom = function () {
        element.parentNode.removeChild(element);
        animationEvent(element, 'AnimationEnd', removeFromDom, true);
    };

    return {
        remove: function () {
            if (!removed) {
                removed = true;
                element.classList.add('animation-intro-end');
                animationEvent(element, 'AnimationEnd', removeFromDom);
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
    console.log('transitioned!');
    bgSecondaryElem.className = bgPrimaryElem.className;
    setTimeout(function () {
        bgSecondaryElem.classList.add('background-transition');
    }, 0);
}

function changeBackground (nextState) {
    // TODO: Triggers a document wide layout, hrr. Should use classList API here instead.
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

    if (!nextState || currentState === nextState) {
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

function changeWorkView (event) {
    var navBarWorkTabElement = event.target;
    var nextWorkView = navBarWorkTabElement.getAttribute('data-work-view');
    var navBarWorkTabElements, i, length;

    if (navBarWorkTabElement.classList.contains('selected')) {
        return false;
    }

    navBarWorkTabElements = navBarWorkTabElement.parentNode.children;

    for (i = 0, length = navBarWorkTabElements.length; i < length; i++) {
        navBarWorkTabElements[i].classList.remove('selected')
    }

    navBarWorkTabElement.classList.add('selected');

    for (i = 0, length = navBarWorkItemElems.length; i < length; i++) {
        navBarWorkItemElems[i].classList.remove('active')
    }

    for (i = 0, length = navBarWorkItemElems.length; i < length; i++) {
        if (nextWorkView === navBarWorkItemElems[i].getAttribute('data-work-view')) {
            navBarWorkItemElems[i].classList.add('active');
            break;
        }
    }

}

function onHashChange (event) {
    var stateRegExp = /\/#(.+)/;
    var currentState = stateRegExp.exec(event.oldURL);
    var nextState = stateRegExp.exec(event.newURL);

    currentState = currentState ? currentState[1] : '';
    nextState = nextState ? nextState[1] : '';

    changeState(currentState, nextState);
}

if (window.location.hash && window.location.hash !== 'home') {
    changeState('home', window.location.hash.replace('#', ''));
}

window.addEventListener('hashchange', onHashChange, false);

navBarWork.addEventListener('click', changeWorkView, false);
