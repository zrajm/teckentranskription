/* Copyright 2017 by zrajm. Released under GPLv3 license. */

// This is a singleton module (i.e. should only be invoked once).
// * args.inElement -- jQuery element
// * args.onGlyphHover -- event function
// * args.onGlyphFocus -- event function
// * args.onGlyphBlur  -- event function
function makeClusterGui(args) {
    var self = {
            clear: clear,
            cue  : cue,
            hide : hide,
            init : initGlyph,
            set  : set,
            show : show,
            uncue: uncue,
        },
        overlayActive = false,
        glyphData = {
            r: [
                "Relation",
                '.top',
                ["r-ingen.svg",   "Ingen",   "_"],
                ["r-over.svg",    "Över",    "o"],
                ["r-under.svg",   "Under",   "u"],
                ["r-bredvid.svg", "Bredvid", "s"],
                ["r-framfor.svg", "Framför", "f"],
                ["r-bakom.svg",   "Bakom",   "b"],
            ],
            a: [ // Artikulationsställe
                "Läge",
                ["a-hjassan.svg",         "Hjässan",                        "a"],
                ["a-ansiktet.svg",        "Ansiktet, huvudhöjd",            "b"],
                ["a-ansiktet-upptill.svg","Ansiktet, övre del",             "c"],
                ["a-ansiktet-nertill.svg","Ansiktet, nedre del",            "d"],
                ["a-pannan.svg",          "Pannan",                         "e"],
                ["a-ogonen.svg",          "Ögonen",                         "f"],
                ["a-ogat.svg",            "Ögat",                           "g"],
                ["a-nasan.svg",           "Näsan",                          "h"],
                ["a-oronen.svg",          "Sidorna av huvudet, öronen",     "i"],
                ["a-orat-vanster.svg",    "Sidan av huvudet, örat, vänster","j"],
                ["a-orat-hoger.svg",      "Sidan av huvudet, örat, höger",  "k"],
                ["a-kinderna.svg",        "Kinderna",                       "l"],
                ["a-kinden-vanster.svg",  "Kinden, vänster",                "m"],
                ["a-kinden-hoger.svg",    "Kinden, höger",                  "n"],
                ["a-munnen.svg",          "Munnen",                         "o"],
                ["a-hakan.svg",           "Hakan",                          "p"],
                ["a-nacken.svg",          "Nacken",                         "q"],
                ["a-halsen.svg",          "Halsen",                         "r"],
                ["a-axlarna.svg",         "Axlarna",                        "s"],
                ["a-axeln-vanster.svg",   "Axeln, vänster",                 "t"],
                ["a-axeln-hoger.svg",     "Axeln, höger",                   "u"],
                ["a-armen.svg",           "Armen",                          "v"],
                ["a-overarmen.svg",       "Överarmen",                      "w"],
                ["a-underarmen.svg",      "Underarmen",                     "x"],
                ["a-brostet.svg",         "Bröstet",                        "y"],
                ["a-brostet-vanster.svg", "Bröstet, vänster sida",          "z"],
                ["a-brostet-hoger.svg",   "Bröstet, höger sida",            "A"],
                ["a-magen.svg",           "Magen, mellangärdet",            "B"],
                ["a-hofterna.svg",        "Höfterna",                       "C"],
                ["a-hoften-vanster.svg",  "Höften, vänster",                "D"],
                ["a-hoften-hoger.svg",    "Höften, höger",                  "E"],
                ["a-benet.svg",           "Benet",                          "F"],
            ],
            h: [
                // Keyboard shortcuts resembles glyphs (no digits). Lower case
                // letters (except c, p, u, y and z) give the same letter (and
                // handshape for that letter in Swedish sign language). Same upper
                // case letter is usually related (commonly with horizontal
                // strikethrough) but some are more farfetched:
                //
                //   Cc - Reversed C (uppercase = angular version thereof).
                //   D  - '4' (4th in alphabet, also handshape similar to 'd').
                //   Pp - Delta (uppercase = vertical strikethrough).
                //   R  - Reversed lower case 'r' (or upside-down J).
                //   Uu - Upside-down U (uppercase = strikethrough).
                //   Yy - Strikethrough Y (uppercase = vertical strikethrough too).
                //   Z  - Strikethrough Z (there is no lower case/plain z).
                "Handform",
                ["h-flata-handen.svg",     "Flata handen",     "j", "hand/flata-handen.png"     ],
                ["h-flata-tumhanden.svg",  "Flata tumhanden",  "J", "hand/flata-tumhanden.png"  ],
                ["h-sprethanden.svg",      "Sprethanden",      "y", "hand/sprethanden.png"      ],
                ["h-4-handen.svg",         "4-handen",         "D", "hand/4-handen.png"         ],
                ["h-d-handen.svg",         "D-handen",         "d", "hand/d-handen.png"         ],
                ["h-f-handen.svg",         "F-handen",         "f", "hand/f-handen.png"         ],
                ["h-vinkelhanden.svg",     "Vinkelhanden",     "F", "hand/vinkelhanden.png"     ],
                ["h-tumvinkelhanden.svg",  "Tumvinkelhanden",  "A", "hand/tumvinkelhanden.png"  ],
                ["h-a-handen.svg",         "A-handen",         "a", "hand/a-handen.png"         ],
                ["h-s-handen.svg",         "S-handen",         "s", "hand/s-handen.png"         ],
                ["h-klohanden.svg",        "Klohanden",        "S", "hand/klohanden.png"        ],
                ["h-o-handen.svg",         "O-handen",         "o", "hand/o-handen.png"         ],
                ["h-knutna-handen.svg",    "Knutna handen",    "g", "hand/knutna-handen.png"    ],
                ["h-e-handen.svg",         "E-handen",         "e", "hand/e-handen.png"         ],
                ["h-tumhanden.svg",        "Tumhanden",        "b", "hand/tumhanden.png"        ],
                ["h-q-handen.svg",         "Q-handen",         "q", "hand/q-handen.png"         ],
                ["h-pekfingret.svg",       "Pekfingret",       "l", "hand/pekfingret.png"       ],
                ["h-l-handen.svg",         "L-handen",         "L", "hand/l-handen.png"         ],
                ["h-raka-matthanden.svg",  "Raka måtthanden",  "C", "hand/raka-matthanden.png"  ],
                ["h-nyphanden.svg",        "Nyphanden",        "P", "hand/nyphanden.png"        ],
                ["h-t-handen.svg",         "T-handen",         "t", "hand/t-handen.png"         ],
                ["h-krokfingret.svg",      "Krokfingret",      "R", "hand/krokfingret.png"      ],
                ["h-matthanden.svg",       "Måtthanden",       "c", "hand/matthanden.png"       ],
                ["h-hallhanden.svg",       "Hållhanden",       "O", "hand/hallhanden.png"       ],
                ["h-langfingret.svg",      "Långfingret",      "r", "hand/langfingret.png"      ],
                ["h-n-handen.svg",         "N-handen",         "n", "hand/n-handen.png"         ],
                ["h-lilla-o-handen.svg",   "Lilla O-handen",   "p", "hand/lilla-o-handen.png"   ],
                ["h-v-handen.svg",         "V-handen",         "v", "hand/v-handen.png"         ],
                ["h-tupphanden.svg",       "Tupphanden",       "V", "hand/tupphanden.png"       ],
                ["h-k-handen.svg",         "K-handen",         "k", "hand/k-handen.png"         ],
                ["h-dubbelkroken.svg",     "Dubbelkroken",     "u", "hand/dubbelkroken.png"     ],
                ["h-bojda-tupphanden.svg", "Böjda tupphanden", "U", "hand/bojda-tupphanden.png" ],
                ["h-m-handen.svg",         "M-handen",         "m", "hand/m-handen.png"         ],
                ["h-w-handen.svg",         "W-handen",         "w", "hand/w-handen.png"         ],
                ["h-lillfingret.svg",      "Lillfingret",      "i", "hand/lillfingret.png"      ],
                ["h-flyghanden.svg",       "Flyghanden",       "I", "hand/flyghanden.png"       ],
                ["h-stora-langfingret.svg","Stora långfingret","Y", "hand/stora-langfingret.png"],
                ["h-runda-langfingret.svg","Runda långfingret","Z", "hand/runda-langfingret.png"],
                ["h-stora-nyphanden.svg",  "Stora nyphanden",  "h", "hand/stora-nyphanden.png"  ],
                ["h-x-handen.svg",         "X-handen",         "x", "hand/x-handen.png"         ],
            ],
            ar: [
                "Attitydsriktning",                       // Cannot be combined with:
                '.top',
                ["ar-vanster.svg", "Vänsterriktad", "v"], //   höger- & vänstervänd
                ["ar-hoger.svg",   "Högerriktad",   "h"], //   -"-
                ["ar-fram.svg",    "Framåtriktad",  "f"], //   framåt- & inåtriktad
                ["ar-in.svg",      "Inåtriktad",    "i"], //   -"-
                ["ar-upp.svg",     "Uppåtriktad",   "u"], //   uppåt- & nedåtvänd
                ["ar-ner.svg",     "Nedåtriktad",   "n"], //   -"-
            ],
            av: [
                "Attitydsvridning",                       // Cannot be combined with:
                ["av-vanster.svg", "Vänstervänd", "v"],   //   höger- & vänsterriktad
                ["av-hoger.svg",   "Högervänd",   "h"],   //   -"-
                ["av-fram.svg",    "Framåtvänd",  "f"],   //   framåt- & inåtriktad
                ["av-in.svg",      "Inåtvänd",    "i"],   //   -"-
                ["av-upp.svg",     "Uppåtvänd",   "u"],   //   uppåt- & nedåtriktad
                ["av-ner.svg",     "Nedåtvänd",   "n"],   //   -"-
            ],
            ina: [
                "Interaktionsart",
                '.top',
                ["i-kors.svg",    "Kors",    "x"],
                ["i-vinkel.svg",  "Vinkel",  "w"],
                ["i-hakning.svg", "Hakning", "X"],
            ],
            artion_tall: [ // Artikulation
                "Rörelseriktning",
                '.top',
                ["rr-vanster.svg",       "Föres åt vänster",              "v"],
                ["rr-hoger.svg",         "Föres åt höger",                "h"],
                ["rr-vanster-hoger.svg", "Föres vänster–höger (sidled)",  "s"],
                ["rr-fram.svg",          "Föres framåt",                  "f"],
                ["rr-in.svg",            "Föres inåt",                    "i"],
                ["rr-fram-in.svg",       "Föres framåt–inåt (djupled)",   "d"],
                ["rr-upp.svg",           "Föres uppåt",                   "u"],
                ["rr-ner.svg",           "Föres nedåt",                   "n"],
                ["rr-upp-ner.svg",       "Föres uppåt–nedåt (höjdled)",   "j"],
                ["rr-kort-upp.svg",      "Föres kort uppåt",              "U"],
                ["rr-kort-ner.svg",      "Föres kort nedåt",              "N"],
                "Rörelseart",
                ["ra-spelar.svg",        "Spelar",                        "~"],
                ["ra-stror.svg",         "Strör",                         "@"],
                ["ra-vinkar.svg",        "Vinkar",                        "#"],
                ["ra-bojs.svg",          "Böjs",                          '"'],
                "Interaktionsart",
                ["i-vaxelvis.svg",       "Växelvis",                      "="],
                ["i-konvergerar.svg",    "Konvergerar",                   ">"],
                ["i-divergerar.svg",     "Divergerar",                    "<"],
                ["i-byte.svg",           "Byte",                          "'"],
                ["i-kors.svg",           "Kors",                          "x"],
                ["i-vinkel.svg",         "Vinkel",                        "w"],
                ["i-hakning.svg",        "Hakning",                       "X"],
                ["i-entre.svg",          "Entré / mottagning",            "e"],
                ["i-kontakt.svg",        "Kontakt",                       "."],
                "Övrigt",
                ["x-upprepning.svg", "Upprepad artikulation",             ":"],
                ["x-separator.svg",  "Markerar sekventiell artikulation", "!"],
            ],
            artion_high: [ // Artikulation
                "Rörelseart",
                '.top',
                ["ra-bage.svg",   "Båge",   "b"],
                ["ra-cirkel.svg", "Cirkel", "c"],
                ["ra-vrids.svg",  "Vrids",  "v"],
                ["ra-slas.svg",   "Slås",   "s"],
            ],
            artion_low: [ // Artikulation
                "Rörelseriktning",
                ["rr-vanster2.svg",       "Åt vänster",             "v"],
                ["rr-hoger2.svg",         "Åt höger",               "h"],
                ["rr-vanster-hoger2.svg", "Vänster–höger (sidled)", "s"],
                ["rr-fram2.svg",          "Framåt",                 "f"],
                ["rr-in2.svg",            "Inåt",                   "i"],
                ["rr-fram-in2.svg",       "Framåt–inåt (djupled)",  "d"],
                ["rr-fixme.svg",          "FIXME",                  "m"],
                ["rr-upp2.svg",           "Uppåt",                  "u"],
                ["rr-ner2.svg",           "Nedåt",                  "n"],
                ["rr-upp-ner2.svg",       "Uppåt–nedåt (höjdled)",  "j"],
            ],
        },
        cueRemove   = {},
        glyphImages = initImages(glyphData),
        glyphImages2 = initImages2(glyphData),
        fieldNameOf = {
            '1': 'i',   '2': 'i',
            '3': 'ii',  '4': 'ii',  '5': 'ii',
            '6': 'iii', '7': 'iii', '8': 'iii', '9': 'iii',
        },
        domElement = {
            i  : $('.field.i',   args.inElement),
            ii : $('.field.ii',  args.inElement),
            iii: $('.field.iii', args.inElement),
            1: $('.cluster.ia',   args.inElement),
            2: $('.cluster.ib',   args.inElement),
            3: $('.cluster.iia',  args.inElement),
            4: $('.cluster.iib',  args.inElement),
            5: $('.cluster.iic',  args.inElement),
            6: $('.cluster.iiia', args.inElement).remove(),
            7: $('.cluster.iiib', args.inElement).remove(),
            8: $('.cluster.iiic', args.inElement).remove(),
            9: $('.cluster.iiid', args.inElement).remove(),
        },
        // Position of in cluster string of these glyphs (note that this
        // includes the magic number, i.e. a cluster has a magic number > 9,
        // the count will have to be increased to accomodate the length of the
        // magic number).
        clusterGlyphNums = {
            1: { r: 1,  a: 2 },
            2: { r: 1,  h: 2, ar: 3, av: 4 },
            3: { r: 1,  h: 2, ar: 3, av: 4 },
            4: { ina: 1 },
            5: { h: 1, ar: 2, av: 3 },
            6: { artion_tall: 1 },
            7: { artion_high: 1, artion_low: 2 },
            8: { h: 1 },
            9: { artion_low: 1 },
        };

    function initImages2(glyphData) {
        var glyphImages = {};

        // Preload cluster images (so that script works even offline).
        $('body').append(
            '<div class="hide">' +
                Object.keys(glyphData).map(function (glyphType) {
                    var html = '';
                    glyphData[glyphType].forEach(function (image) {
                        if (typeof image === 'string') { return; }
                        if (image[0]) { html += '<img src="pic/' + image[0] + '">'; }
                        if (image[3]) { html += '<img src="pic/' + image[3] + '">'; }
                    });
                    return html;
                }).join('') + '</div>');

        // Create lookup object.
        // Syntax: glyphImages[glyphType][shortkey] = html
        // {
        //     r: {
        //         _: '<img src="pic/r-ingen.svg">',
        //         o: '<img src="pic/r-over.svg">',
        //         ... },
        //     a: { ... },
        //     ... }
        Object.keys(glyphData).forEach(function (glyphType) {
            var glyphList = glyphData[glyphType];
            glyphImages[glyphType] = {};
            glyphList.
                filter(function (value) { return typeof value !== 'string'; }).
                forEach(function (value, index) {
                    var file = value[0], shortkey = value[2],
                        html = '<img src="pic/' + file + '">';
                    glyphImages[glyphType][shortkey] = html;
                });
        });
        return glyphImages;
    }

    function initImages(glyphData) {
        var glyphImages = {};
        Object.keys(glyphData).forEach(function (glyphType) {
            var glyphList = glyphData[glyphType];
            glyphImages[glyphType] = {};
            glyphList.
                filter(function (value) { return typeof value !== 'string'; }).
                forEach(function (value, index) {
                    var file = value[0], shortkey = value[2],
                        html = '<img src="pic/' + file + '">';
                    glyphImages[glyphType][index] = html;
                });
        });
        return glyphImages;
    }

    // Return jQuery element for a new clusterType without displaying it in the
    // GUI. DOM elements for clusters in field I & II are reused, while
    // elements for clusters in field III are added.
    function initGlyph(clusterNum) {
        var element, fieldType = fieldNameOf[clusterNum], glyphElements;
        if (fieldType === 'i' || fieldType === 'ii') {
            element = domElement[clusterNum];  // reuse existing DOM element
        } else if (fieldType === 'iii') {      // create new DOM element
            element = domElement[clusterNum].clone();
            domElement['iii'].append(element);
        } else {
            throw TypeError("Invalid cluster type number '" + clusterNum + "'");
        }
        if (args.onGlyphHover || args.onGlyphFocus) {
            glyphElements = element.find('.glyph').off('hover focus blur');
            if (args.onGlyphHover) {
                glyphElements.hover(function (event) {
                    if (!overlayActive) { args.onGlyphHover(event); };
                });
            }
            if (args.onGlyphFocus) { glyphElements.focus(args.onGlyphFocus); }
            if (args.onGlyphBlur ) { glyphElements.blur (args.onGlyphBlur);  }
        }
        return element;
    }

    // Set all glyphs to first value in glyph list.
    function clear() {
        var clusterNums = Object.keys(fieldNameOf);
        clusterNums.forEach(function (clusterNum) {
            var glyphTypes = clusterGlyphTypes[clusterNum];
            // FIXME -- Should this really use glyphType?
            glyphTypes.forEach(function (glyphType) {
                var glyphHtml      = glyphImages[glyphType][0],  // FIXME use glyphImages2 instead(?)
                    clusterElement = domElement[clusterNum];
                $('.' + glyphType, clusterElement).html(glyphHtml);
            });
        });
        domElement['i']  .children('.cluster').addClass('hide');
        domElement['ii'] .children('.cluster').addClass('hide');
        domElement['iii'].children('.cluster').remove();
        hideAllEmptyFieldElements();
    }

    // Populate specified cluster table (in DOM) with values.
    function set(cluster) {
        var clusterNum     = cluster.getNum(),
            clusterStr     = cluster.getStr(),
            clusterElement = cluster.get('_element'),
            glyphTypes = clusterGlyphTypes[clusterNum],
            glyphChars = clusterStr.substr(1).split('');

        if (glyphTypes === undefined) {
            throw TypeError("Invalid cluster type number '" + clusterNum + "'");
        }
        if (clusterElement === undefined) {
            throw TypeError("Missing '_element' property in cluster");
        }

        glyphChars.forEach(function (glyphStr, index) {
            var glyphType = glyphTypes[index],
                html  = glyphImages2[glyphType][glyphStr] || glyphStr,
                glyph = $('.' + glyphType, clusterElement);
            glyph.html(html);
            // Special case for 'medial contact' and 'separator' glyphs.
            // (Bottom aligned using CSS class 'low'.)
            if (html.match(/\/x-separator\.svg"/)) {
                glyph.addClass('low');
            } else {
                glyph.removeClass('low');
            }
        });

        return self;                           // chainable
    }

    // Show cluster in GUI. Return jQuery element for the shown cluster. (CSS
    // class 'cue' are used to indicate cue mode.)
    function show(cluster) {
        var clusterNum     = cluster.getNum(),
            clusterElement = cluster.get('_element'),
            glyphTypes     = clusterGlyphTypes[clusterNum];

        uncue();
        if (!clusterElement.hasClass('hide')) { return; }

        clusterElement.                        // cluster + field element
            add(clusterElement.closest('.field', args.inElement)).
            removeClass('cue hide');

        function glyphMenu(glyphType) {
            var menuSpec     = glyphData[glyphType],
                glyphNum     = clusterGlyphNums[clusterNum][glyphType],
                currentValue = cluster.getStr()[glyphNum];

            selectGlyph(menuSpec, currentValue, function (value) {
                cluster.set(glyphNum, value);
            });
        }

        glyphTypes.forEach(function (glyphType) {
            $('.' + glyphType, clusterElement).
                off('click keydown').
                click(function () {
                    glyphMenu(glyphType);
                    return false;
                }).
                keydown(function (event) {
                    if (event.key === "Enter") {
                        glyphMenu(glyphType);
                        return false;
                    }
                    console.log('Input: >' + event.key + '<');
                    return true;
                });
        });
    }

    // Hide specified cluster in GUI. (For clusters of type I and II, hide the
    // cluster without removing it from the DOM, for clusters of type III the
    // cluster is removed from the DOM.)
    function hide(clusterElement) {
        var fieldElement = clusterElement.closest('.field', args.inElement);
        uncue();

        if (fieldElement.length === 0) {       // cluster not in
            return false;                      //    transcription field
        }
        if (fieldElement.hasClass('iii')) {    // field III
            clusterElement.remove();
        } else {                               // field I + II
            if (clusterElement.hasClass('hide')) {
                return false;                  //   cluster already hidden
            }
            clusterElement.addClass('hide').
                find('*').off();               //   remove event handlers
        }
        hideEmptyFieldElement(fieldElement);
        return true;
    }

    function showParentFieldElement(clusterElement) {
        var fieldElement = clusterElement.closest('.field', args.inElement);
        fieldElement.removeClass('hide');
    }

    // Hide all fields in which no clusters are currently shown.
    function hideAllEmptyFieldElements() {
        ['i', 'ii', 'iii'].forEach(function (fieldType) {
            hideEmptyFieldElement(domElement[fieldType]);
        });
    }

    function hideEmptyFieldElement(fieldElement) {
        var clusterCount = $('.cluster:not(.hide)', fieldElement).length;
        if (clusterCount === 0) {
            fieldElement.addClass('hide');
        }
    }

    // Cue change to specified cluster. (Works with all clusters.)
    function cue(clusterNum) {
        var fieldType      = fieldNameOf[clusterNum],
            clusterElement = domElement[clusterNum],
            isHidden       = clusterElement.hasClass('hide');

        if (fieldType === 'iii') {
            clusterElement = gui.init(clusterNum).
                addClass('cue').removeClass('hide');
            cueRemove[clusterNum] = function () { gui.hide(clusterElement); };
            showParentFieldElement(clusterElement);
            return self;
        }

        if (fieldType !== 'i' && fieldType !== 'ii') {
            throw TypeError("Invalid cluster type number '" + clusterNum + "' " +
                "(only type numer '1' & '2' can be previewed)");
        }

        // Visible already = do nada.
        if (!isHidden) { return self; }

        uncue(clusterNum);
        cueRemove[clusterNum] = isHidden ?     // setup cue removal function
            function () {                      //   hide again + remove cue
                clusterElement.addClass('hide').removeClass('cue');
            } :
            function () {                      //    show again + remove cue
                clusterElement.removeClass('hide cue');
            };

        clusterElement.addClass('cue').removeClass('hide');
        showParentFieldElement(clusterElement);
        return self;
    }

    // Undo the effects of any currently active cue.
    function uncue(clusterNum) {
        var clusterNums = clusterNum ? [ clusterNum ] : Object.keys(cueRemove);
        clusterNums.forEach(function (clusterNum) {
            var f = cueRemove[clusterNum];
            if (typeof f === 'function') {
                delete cueRemove[clusterNum];
                return f();
            }
        });
        hideAllEmptyFieldElements();
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Glyph Selector Menu
    //

    function selectGlyph(menu, defaultGlyphStr, callback) {
        var tableElement    = $('table', overlayElement),
            selectedElement = $(document.activeElement),
            rowElements;
        overlayActive = true;

        function createMenu(menu) {
            var shortkeys = {}, index = 0, cssClass = 'bottom',
                tableHtml = "", url   = window.location.href;
            bodyElement.addClass('overlay');
            windowElement.on('popstate', destroyMenu);
            history.pushState({}, document.title + ": Select Glyph",
                              url + (url.match(/#/) ? '' : '#' ) + '?menu');

            menu.forEach(function (value) {
                if (typeof value === 'string') {
                    if (value[0] === '.') {
                        cssClass = value.substr(1);
                    } else {
                        tableHtml += '<tr><th colspan=4>' + value;
                    }
                } else {
                    var glyph    = value[0],
                        text     = value[1],
                        shortkey = value[2],
                        image    = value[3],
                        shortkeyHtml = '<td class="right shortkey">' +
                            (shortkey.match(/^[A-Z]$/) ? 'Shift+' : '') +
                            shortkey.toUpperCase()
                    shortkeys[shortkey] = index;
                    tableHtml += '<tr tabindex=1 data-num=' + index + ' ' +
                        'data-value="' + escapeHtml(shortkey) + '"' +
                        (defaultGlyphStr === shortkey ? ' class=selected' : '') + '>' +
                        '<td class=' + cssClass + '><img src="pic/' + glyph + '">' +
                        (image ? '<td><img src="pic/' + image + '">' : '<td>') +
                        '<td class=left>' + text + shortkeyHtml;
                    index += 1;
                }
            });
            tableElement.html(tableHtml);
            rowElements = $('tr[tabindex]', tableElement);
            overlayElement.
                off('keydown click').
                keydown(handleMenuKeys(shortkeys)).
                click(handleMenuClick);

            // Focus items in menu on hover (but ignore false hover events
            // caused by page scrolling moving mouse pointer relative to the
            // page itself).
            (function () {
                var mouseActive = false, lastY = 0;
                overlayElement.
                    keydown(function () { mouseActive = false; }).
                    mousemove(function (event) {
                        if (mouseActive === false && lastY !== event.screenY) {
                            mouseActive = true;
                        }
                        lastY = event.screenY;
                    }).find('tr').hover(function () {
                        if (mouseActive === true) {
                            $(this).focus();
                        }
                    });
            }());
            overlayElement.css('display', 'block')
            rowElements.filter('.selected').focus();
        }

        function destroyMenu(backButtonEvent, callback) {
            if (!backButtonEvent) { history.back(); }
            bodyElement.removeClass('overlay');
            windowElement.off('popstate');
            overlayElement.off().css('display', 'none').
                find('tr').off();
            tableElement.empty();
            selectedElement.focus();           // reselect previously focused
            overlayActive = false;
            if (callback) { setTimeout(function () { callback(); }, 1); }
        }

        function handleMenuClick(event) {
            var element = $(event.target),
                value   = element.closest('tr').data('value');
            destroyMenu(false, function () {
                if (value !== undefined) { callback(value); }
            });
            return false;
        }

        function handleMenuKeys(shortkeys) {
            // FIXME: Isn't shortkey always be set now? (Throw exception instead?)
            shortkeys = shortkeys || {};
            return function (event) {
                var element = $(event.target),
                    itemNum = element.data('num');

                // Let browser handle key combinations with Ctrl or Alt.
                if (event.altKey || event.ctrlKey) { return true; }

                if (shortkeys[event.key] !== undefined) {
                    destroyMenu(false, function () {
                        callback(event.key);
                    });
                    return false;
                }
                switch (event.key) {
                case "Escape":
                    destroyMenu();
                    return false;
                case "ArrowUp":
                    itemNum -= 1;
                    if (itemNum < 0) { itemNum = 0; }
                    rowElements[itemNum].focus();
                    return false;
                case "ArrowDown":
                    itemNum += 1;
                    if (itemNum >= rowElements.length) {
                        itemNum = rowElements.length - 1;
                    }
                    rowElements[itemNum].focus();
                    return false;
                case "End":
                    itemNum = rowElements.length - 1;
                    rowElements[itemNum].focus();
                    return false;
                case "Enter":
                    destroyMenu(false, function () {
                        callback(element.data('value'));
                    });
                    return false;
                case "Home":
                    itemNum = 0;
                    rowElements[itemNum].focus();
                    return false;
                case "PageDown":
                    itemNum += 5;
                    if (itemNum >= rowElements.length) {
                        itemNum = rowElements.length - 1;
                    }
                    rowElements[itemNum].focus();
                    return false;
                case "PageUp":
                    itemNum -= 5;
                    if (itemNum < 0) { itemNum = 0; }
                    rowElements[itemNum].focus();
                    return false;
                default:
                    console.log("Menu keypress: >" + event.key + "<");
                    return true;
                }
            }
        }
        createMenu(menu);
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Drag-and-Drop Stuff
    //

    (function () {
        var startSibling;

        // Drag event: Put number on each '.cluster' element visible in DOM and
        // add 'drag' class to parent field element.
        function enumerateDragElements(element, source) {
            $(element).closest('.sign').addClass('drag');
            $('.cluster:not(.hide)').
                each(function (i, element) {
                    $(element).data('n', i);
                    $(element).attr('n', i);
                });
        }

        // Drag ended: Remove 'drag' class from parent field element.
        function removeFieldDragClass(element) {
            $(element).closest('.sign').removeClass('drag');
        }

        // Drop event: Get number from element + sibling element that comes
        // after it, then move element to the position given by sibling (if no
        // sibling comes after it move it to last position).
        function moveCluster(element, _, _, sibling) {
            var clusterNumber = $(element).data('n'),
                position      = $(sibling).data('n');
            if (position === undefined) { position = transcript.length(); }
            if (position > clusterNumber) { position -= 1; }
            transcript.move(clusterNumber, position);
        }

        // Remove event: Get number from element, then delete that cluster.
        function removeCluster(element) {
            var clusterNumber = $(element).data('n');
            transcript.remove(clusterNumber);
            // FIXME: Put back the removed element if cluster in field I or II
            hideAllEmptyFieldElements();
        }

        // Get next jQuery element sibling without 'hide' class.
        function nextVisible(element) {
            var element = $(element).next();
            while (element && element.hasClass('hide')) {
                element = element.next();
            }
            return element[0] || null;
        }

        function enumerateDragElementsAndRemeberSibling(element, source) {
            startSibling = nextVisible(element);
            enumerateDragElements(element, source);
        }

        function noPositionChange(element, _, _, sibling) {
            // Dragula erroneously pass the currently dragged element as
            // 'sibling' sometimes, in which case we need to find out the real
            // sibling.
            if (element === sibling) { sibling = nextVisible(sibling); }

            // Only accept drag-and-drop if it results in no change.
            if (startSibling === sibling) { return true; }
            return false;
        }

        dragula($('.field.i', args.inElement).toArray(), {
            direction: 'horizontal',
            removeOnSpill: true,
            accepts: noPositionChange,
        }).
            on('drag',   enumerateDragElementsAndRemeberSibling).
            on('remove', removeCluster).
            on('dragend', removeFieldDragClass);

        dragula($('.field.ii', args.inElement).toArray(), {
            direction: 'horizontal',
            removeOnSpill: true,
            accepts: noPositionChange,
        }).
            on('drag',   enumerateDragElementsAndRemeberSibling).
            on('remove', removeCluster).
            on('dragend', removeFieldDragClass);

        dragula($('.field.iii', args.inElement).toArray(), {
            direction: 'horizontal',
            removeOnSpill: true,
        }).
            on('drag',   enumerateDragElements).
            on('remove', removeCluster).
            on('drop',   moveCluster).
            on('dragend', removeFieldDragClass);
    }());

    ////////////////////////////////////////////////////////////////////////////

    clear();
    return self;
}

//[eof]
