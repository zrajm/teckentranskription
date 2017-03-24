/* Copyright 2017 by zrajm. Released under GPLv3 license. */

// ([a-zA-Z0-9?/:@._~!$&'()*+,;=-]|%[0-9a-fA-F]{2})

function makeUrlFragmentTrigger(onHashChange) {
    var active = true;
    if (onHashChange) { $(window).on('hashchange', onHashChange); }

    // Trigger fragment event on pageload.
    $(function () { $(window).trigger('hashchange'); });

    return {
        get: function () {
            return (window.location.hash || '').replace(/^#/, '');
        },
        set: function (str) {
            var title = document.title + ': ' + str;
            history.pushState({}, title, '#' + str);
        },
    };
}

var glyphData = init(),
    // FIXME merge 'clusterGlyphTypes' and 'clusterGlyphNums'? (in clustergui.js)
    clusterGlyphTypes = {
        1: [ 'r',  'a' ],
        2: [ 'r',  'h', 'ar', 'av' ],
        3: [ 'r',  'h', 'ar', 'av' ],
        4: [ 'ina' ],
        5: [ 'h', 'ar', 'av' ],
        6: [ 'artion_tall' ],
        7: [ 'artion_high', 'artion_low' ],
        8: [ 'h' ],
        9: [ 'artion_low' ],
    },
    urlFragment = makeUrlFragmentTrigger(onHashChange);

////////////////////////////////////////////////////////////////////////////

// Table for looking up glyph number <-> glyph character (both ways), in each
// cluster type. Returned data structure format:
// {
//     r: { 0: "_", ..., 5 : "b", _: 0, ..., b: 5  },
//     a: { 0: "a", ..., 31: "F", a: 0, ..., F: 31 },
//     ...
// }
function init() {
    var glyphKeys = {
        // FIXME: Autogenerate these from makeClusterGui's glyphData variable
        // (so that one only need to update in one place)
        // ([a-zA-Z0-9?/:@._~!$&'()*+,;=-]|%[0-9a-fA-F]{2})
        r: "_ousfb",                                   // Relation
        a: "abcdefghijklmnopqrstuvwxyzABCDEF",         // Artikulationsställe
        h: "jJyDdfFAasSogebqlLCPtRcOrnpvVkuUmwiIYZhx", // Handform
        ar: "vhfiun",                                  // Attitydsriktning
        av: "vhfiun",                                  // Attitydsvridning
        ina: "xwX",                                    // Interaktionsart
        artion_tall: "vhsfidunjUN~@#\"=><'xwXe.:!",    // Artikulation
        artion_high: "bcvs",                           // Artikulation
        artion_low: "vhsfidmunj",                      // Artikulation
    };
    return Object.keys(glyphKeys).reduce(function (acc, glyphClass) {
        var chars = glyphKeys[glyphClass].split('');
        acc[glyphClass] = chars.reduce(function (acc, char, i) {
            // Return obj with key = each char of 'str' / value = pos of
            // that char in 'str'.
            acc[char] = i;
            acc[i] = char;
            return acc;
        }, {});
        return acc;
    }, {});
}

// Specifying a URL fragment should be like pressing 'Clear', then
// entering a transcript.
function onHashChange() {
    var fromStorage,
        fromUrl        = urlFragment.get(),
        fromUrlNoQuery = fromUrl.replace(/\?.*$/, '');

    // Remove any query string (e.g. '?menu') without adding to history.
    if (fromUrl !== fromUrlNoQuery) {
        history.replaceState({}, document.title, '#' + fromUrlNoQuery);
    }

    if (fromUrl !== '') {
        fromStorage = transcript.getStr();
        if (fromUrl !== fromStorage) {
            saveInputElement.val("");
            transcript.set(fromUrl, false);    // suppress URL hash update

            // If fragment changed when storing, update the URL fragment.
            fromStorage = transcript.getStr();
            if (fromUrl !== fromStorage) {
                history.replaceState({}, document.title, '#' + fromStorage);
            }
        }
    }
}

//[eof]
