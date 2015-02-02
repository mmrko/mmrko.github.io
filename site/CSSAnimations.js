function CSSAnimation(){
    /*
        webkitAnimationName => Safari/Chrome
        MozAnimationName => Mozilla Firefox
        OAnimationName => Opera
        animationName => compliant browsers (inc. IE10)
     */
    var supported = false;
    var prefixes = ['webkit', 'Moz', 'O', ''];
    var limit = prefixes.length;
    var doc = document.documentElement.style;
    var prefix, start, end;

    while (limit--) {
        // If the compliant browser check (in this case an empty string value) then we need to check against different string (animationName and not prefix + AnimationName)
        if (!prefixes[limit]) {
            // If not undefined then we've found a successful match
            if (doc['animationName'] !== undefined) {
                prefix = prefixes[limit];
                start = 'animationstart';
                end = 'animationend';
                supported = true;
                break;
            }
        }
        // Other brower prefixes to be checked
        else {
            // If not undefined then we've found a successful match
            if (doc[prefixes[limit] + 'AnimationName'] !== undefined) {
                prefix = prefixes[limit];

                switch (limit) {
                    case 0:
                        //  webkitAnimationStart && webkitAnimationEnd
                        start = prefix.toLowerCase() + 'AnimationStart';
                        end = prefix.toLowerCase() + 'AnimationEnd';
                        supported = true;
                        break;

                    case 1:
                        // animationstart && animationend
                        start = 'animationstart';
                        end = 'animationend';
                        supported = true;
                        break;

                    case 2:
                        // oanimationstart && oanimationend
                        start = prefix.toLowerCase() + 'animationstart';
                        end = prefix.toLowerCase() + 'animationend';
                        supported = true;
                        break;
                }

                break;
            }
        }
    }

    return {
        supported: supported,
        prefix: prefix,
        start: start,
        end: end
    };
}

module.exports = CSSAnimation();