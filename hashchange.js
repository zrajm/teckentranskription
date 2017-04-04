/* Copyright 2017 by zrajm. Released under GPLv3 license. */

// ([a-zA-Z0-9?/:@._~!$&'()*+,;=-]|%[0-9a-fA-F]{2})

function makeUrlFragmentTrigger(onHashChange) {
    if (onHashChange) { $(window).on('hashchange', onHashChange); }
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

var glyphNumChrMap = init(),
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
    urlFragment = makeUrlFragmentTrigger(function () {
        loadFragment(urlFragment.get());
        $('.glyph').focus();
    });

////////////////////////////////////////////////////////////////////////////

// Table for looking up glyph number <-> glyph character (both ways), for each
// cluster type. Returned data structure format:
//
// {
//     r: { 0: "_", ..., 5 : "b", _: 0, ..., b: 5  },
//     a: { 0: "a", ..., 31: "F", a: 0, ..., F: 31 },
//     ...
// }
function init() {
    var glyphKeys = {
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

// Strip parameters (e.g. '?menu') from URL fragment without adding to history.
// Return fragment with parameters stripped.
function stripUrlParam(fragment) {
    var noParam = (fragment||'').replace(/[?].*$/, '');
    if (fragment !== noParam) {
        history.replaceState({}, document.title, '#' + noParam);
    }
    return noParam;
}

function loadFragment(fragment) {
    var fragment = stripUrlParam(fragment),
        current  = transcript.getStr();

    if (fragment !== current) {
        transcript.set(fragment, false);    // suppress URL fragment update
        transcript.changed(true);

        // If transcript was modified by storing, write back to URL fragment.
        current = transcript.getStr();
        if (fragment !== current) {
            history.replaceState({}, document.title, '#' + current);
        }
    }
}

//[eof]
