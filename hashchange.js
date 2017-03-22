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
    clusterTypes = {
        1: 'ia',   2: 'ib',
        3: 'iia',  4: 'iib',  5: 'iic',
        6: 'iiia', 7: 'iiib', 8: 'iiic', 9: 'iiid',
        ia:   '1', ib:   '2',
        iia:  '3', iib:  '4', iic:  '5',
        iiia: '6', iiib: '7', iiic: '8', iiid: '9',
    },
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

// Return { r: { _: 0, o:1, u:2...}, a: { a:0, b:1...}, ... } structure
// created from above data.
function init() {
    var glyphKeys = {
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

// Convert '3fyui5yui6x6X6~' string into internal cluster format.
function fragmentParse(signStr) {
    var signSpec = [];
    signStr.split(/(?=[0-9])/).forEach(function (clusterStr) {
        var parseGood   = true,
            clusterNum  = clusterStr[0],
            glyphChars  = clusterStr.slice(1).split(''),
            glyphTypes  = clusterGlyphTypes[clusterNum] || [],
            clusterSpec;
        if (clusterTypes[clusterNum]) {
            clusterSpec = glyphChars.reduce(function (acc, chr, i) {
                var glyphType = glyphTypes[i],
                    glyphNum  = (glyphData[glyphType]||{})[chr];
                if (glyphNum !== undefined) {
                    acc[glyphType] = glyphNum;
                } else {
                    parseGood = false;
                }
                return acc;
            }, { type: clusterTypes[clusterNum] });
            if (parseGood) { signSpec.push(clusterSpec); }
        }
    });
    return signSpec;
}

function fragmentStringify(signSpec) {
    return signSpec.map(function (clusterSpec) {
        var clusterNum = clusterTypes[clusterSpec.type],
            glyphTypes = clusterGlyphTypes[clusterNum];
        return clusterNum + glyphTypes.map(function (glyphType) {
            var glyphNum  = clusterSpec[glyphType],
                glyphChar = glyphData[glyphType][glyphNum];
            return glyphChar;
        }).join('');
    }).join('');
}

// Specifying a URL fragment should be like pressing 'Clear', then
// entering a transcript.
function onHashChange (event) {
    var fromStorage, sign,
        fromUrl        = urlFragment.get(),
        fromUrlNoQuery = fromUrl.replace(/\?.*$/, '');

    // Remove any query string (e.g. '?menu') without adding to history.
    if (fromUrl !== fromUrlNoQuery) {
        history.replaceState({}, document.title, '#' + fromUrlNoQuery);
    }

    if (fromUrl !== '') {
        fromStorage = fragmentStringify(transcript.get());
        if (fromUrl !== fromStorage) {
            sign = fragmentParse(fromUrl);
            if (sign.length === 0) {
                alert('Failed to parse URL fragment into a valid transcript.');
            } else {
                transcript.set(sign, false);   // suppress URL hash update
                saveInputElement.val("");
            }
        }
    }
}

//[eof]
