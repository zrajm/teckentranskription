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
        bodyElement   = $(document.body),
        windowElement = $(window),
        overlayActive = false,
        glyphData = {
            r: [
                "Relation",
                '.top',
                ["r-ingen",   "Ingen",   "_"],
                ["r-over",    "Över",    "o"],
                ["r-under",   "Under",   "u"],
                ["r-bredvid", "Bredvid", "s"],
                ["r-framfor", "Framför", "f"],
                ["r-bakom",   "Bakom",   "b"],
            ],
            a: [ // Artikulationsställe
                "Läge",
                ["a-hjassan",         "Hjässan",                        "a"],
                ["a-ansiktet",        "Ansiktet, huvudhöjd",            "b"],
                ["a-ansiktet-upptill","Ansiktet, övre del",             "c"],
                ["a-ansiktet-nertill","Ansiktet, nedre del",            "d"],
                ["a-pannan",          "Pannan",                         "e"],
                ["a-ogonen",          "Ögonen",                         "f"],
                ["a-ogat",            "Ögat",                           "g"],
                ["a-nasan",           "Näsan",                          "h"],
                ["a-oronen",          "Sidorna av huvudet, öronen",     "i"],
                ["a-orat-vanster",    "Sidan av huvudet, örat, vänster","j"],
                ["a-orat-hoger",      "Sidan av huvudet, örat, höger",  "k"],
                ["a-kinderna",        "Kinderna",                       "l"],
                ["a-kinden-vanster",  "Kinden, vänster",                "m"],
                ["a-kinden-hoger",    "Kinden, höger",                  "n"],
                ["a-munnen",          "Munnen",                         "o"],
                ["a-hakan",           "Hakan",                          "p"],
                ["a-nacken",          "Nacken",                         "q"],
                ["a-halsen",          "Halsen",                         "r"],
                ["a-axlarna",         "Axlarna",                        "s"],
                ["a-axeln-vanster",   "Axeln, vänster",                 "t"],
                ["a-axeln-hoger",     "Axeln, höger",                   "u"],
                ["a-armen",           "Armen",                          "v"],
                ["a-overarmen",       "Överarmen",                      "w"],
                ["a-underarmen",      "Underarmen",                     "x"],
                ["a-brostet",         "Bröstet",                        "y"],
                ["a-brostet-vanster", "Bröstet, vänster sida",          "z"],
                ["a-brostet-hoger",   "Bröstet, höger sida",            "A"],
                ["a-magen",           "Magen, mellangärdet",            "B"],
                ["a-hofterna",        "Höfterna",                       "C"],
                ["a-hoften-vanster",  "Höften, vänster",                "D"],
                ["a-hoften-hoger",    "Höften, höger",                  "E"],
                ["a-benet",           "Benet",                          "F"],
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
                ["h-flata-handen",     "Flata handen",     "j", "flata-handen"     ],
                ["h-flata-tumhanden",  "Flata tumhanden",  "J", "flata-tumhanden"  ],
                ["h-sprethanden",      "Sprethanden",      "y", "sprethanden"      ],
                ["h-4-handen",         "4-handen",         "D", "4-handen"         ],
                ["h-d-handen",         "D-handen",         "d", "d-handen"         ],
                ["h-f-handen",         "F-handen",         "f", "f-handen"         ],
                ["h-vinkelhanden",     "Vinkelhanden",     "F", "vinkelhanden"     ],
                ["h-tumvinkelhanden",  "Tumvinkelhanden",  "A", "tumvinkelhanden"  ],
                ["h-a-handen",         "A-handen",         "a", "a-handen"         ],
                ["h-s-handen",         "S-handen",         "s", "s-handen"         ],
                ["h-klohanden",        "Klohanden",        "S", "klohanden"        ],
                ["h-o-handen",         "O-handen",         "o", "o-handen"         ],
                ["h-knutna-handen",    "Knutna handen",    "g", "knutna-handen"    ],
                ["h-e-handen",         "E-handen",         "e", "e-handen"         ],
                ["h-tumhanden",        "Tumhanden",        "b", "tumhanden"        ],
                ["h-q-handen",         "Q-handen",         "q", "q-handen"         ],
                ["h-pekfingret",       "Pekfingret",       "l", "pekfingret"       ],
                ["h-l-handen",         "L-handen",         "L", "l-handen"         ],
                ["h-raka-matthanden",  "Raka måtthanden",  "C", "raka-matthanden"  ],
                ["h-nyphanden",        "Nyphanden",        "P", "nyphanden"        ],
                ["h-t-handen",         "T-handen",         "t", "t-handen"         ],
                ["h-krokfingret",      "Krokfingret",      "R", "krokfingret"      ],
                ["h-matthanden",       "Måtthanden",       "c", "matthanden"       ],
                ["h-hallhanden",       "Hållhanden",       "O", "hallhanden"       ],
                ["h-langfingret",      "Långfingret",      "r", "langfingret"      ],
                ["h-n-handen",         "N-handen",         "n", "n-handen"         ],
                ["h-lilla-o-handen",   "Lilla O-handen",   "p", "lilla-o-handen"   ],
                ["h-v-handen",         "V-handen",         "v", "v-handen"         ],
                ["h-tupphanden",       "Tupphanden",       "V", "tupphanden"       ],
                ["h-k-handen",         "K-handen",         "k", "k-handen"         ],
                ["h-dubbelkroken",     "Dubbelkroken",     "u", "dubbelkroken"     ],
                ["h-bojda-tupphanden", "Böjda tupphanden", "U", "bojda-tupphanden" ],
                ["h-m-handen",         "M-handen",         "m", "m-handen"         ],
                ["h-w-handen",         "W-handen",         "w", "w-handen"         ],
                ["h-lillfingret",      "Lillfingret",      "i", "lillfingret"      ],
                ["h-flyghanden",       "Flyghanden",       "I", "flyghanden"       ],
                ["h-stora-langfingret","Stora långfingret","Y", "stora-langfingret"],
                ["h-runda-langfingret","Runda långfingret","Z", "runda-langfingret"],
                ["h-stora-nyphanden",  "Stora nyphanden",  "h", "stora-nyphanden"  ],
                ["h-x-handen",         "X-handen",         "x", "x-handen"         ],
            ],
            ar: [
                "Attitydsriktning",
                '.top',
                ["ar-vanster", "Vänsterriktad", "v"],
                ["ar-hoger",   "Högerriktad",   "h"],
                ["ar-fram",    "Framåtriktad",  "f"],
                ["ar-in",      "Inåtriktad",    "i"],
                ["ar-upp",     "Uppåtriktad",   "u"],
                ["ar-ner",     "Nedåtriktad",   "n"],
            ],
            av: [
                "Attitydsvridning",
                ["av-vanster", "Vänstervänd", "v"],
                ["av-hoger",   "Högervänd",   "h"],
                ["av-fram",    "Framåtvänd",  "f"],
                ["av-in",      "Inåtvänd",    "i"],
                ["av-upp",     "Uppåtvänd",   "u"],
                ["av-ner",     "Nedåtvänd",   "n"],
            ],
            ina: [
                "Interaktionsart",
                '.top',
                ["i-kors",    "Kors",    "x"],
                ["i-vinkel",  "Vinkel",  "w"],
                ["i-hakning", "Hakning", "X"],
            ],
            artion_tall: [ // Artikulation
                "Rörelseriktning",
                '.top',
                ["rr-vanster",       "Föres åt vänster",              "v"],
                ["rr-hoger",         "Föres åt höger",                "h"],
                ["rr-vanster-hoger", "Föres vänster–höger (sidled)",  "s"],
                ["rr-fram",          "Föres framåt",                  "f"],
                ["rr-in",            "Föres inåt",                    "i"],
                ["rr-fram-in",       "Föres framåt–inåt (djupled)",   "d"],
                ["rr-upp",           "Föres uppåt",                   "u"],
                ["rr-ner",           "Föres nedåt",                   "n"],
                ["rr-upp-ner",       "Föres uppåt–nedåt (höjdled)",   "j"],
                ["rr-kort-upp",      "Föres kort uppåt",              "U"],
                ["rr-kort-ner",      "Föres kort nedåt",              "N"],
                "Rörelseart",
                ["ra-spelar",        "Spelar",                        "~"],
                ["ra-stror",         "Strör",                         "@"],
                ["ra-vinkar",        "Vinkar",                        "#"],
                ["ra-bojs",          "Böjs",                          '"'],
                "Interaktionsart",
                ["i-vaxelvis",       "Växelvis",                      "="],
                ["i-konvergerar",    "Konvergerar",                   ">"],
                ["i-divergerar",     "Divergerar",                    "<"],
                ["i-byte",           "Byte",                          "'"],
                ["i-kors",           "Kors",                          "x"],
                ["i-vinkel",         "Vinkel",                        "w"],
                ["i-hakning",        "Hakning",                       "X"],
                ["i-entre",          "Entré / mottagning",            "e"],
                ["i-kontakt",        "Kontakt",                       "."],
                "Övrigt",
                ["x-upprepning", "Upprepad artikulation",             ":"],
                ["x-separator",  "Markerar sekventiell artikulation", "!"],
            ],
            artion_high: [ // Artikulation
                "Rörelseart",
                '.top',
                ["ra-bage",   "Båge",   "b"],
                ["ra-cirkel", "Cirkel", "c"],
                ["ra-vrids",  "Vrids",  "v"],
                ["ra-slas",   "Slås",   "s"],
            ],
            artion_low: [ // Artikulation
                "Rörelseriktning",
                ["rr-vanster2",       "Åt vänster",             "v"],
                ["rr-hoger2",         "Åt höger",               "h"],
                ["rr-vanster-hoger2", "Vänster–höger (sidled)", "s"],
                ["rr-fram2",          "Framåt",                 "f"],
                ["rr-in2",            "Inåt",                   "i"],
                ["rr-fram-in2",       "Framåt–inåt (djupled)",  "d"],
                ["rr-fixme",          "FIXME",                  "m"],
                ["rr-upp2",           "Uppåt",                  "u"],
                ["rr-ner2",           "Nedåt",                  "n"],
                ["rr-upp-ner2",       "Uppåt–nedåt (höjdled)",  "j"],
            ],
        },
        cueRemove   = {},
        glyphImages = initImages(glyphData),
        fieldNameOf = {        // cluster number -> field number mapping
            1: 1, 2: 1,
            3: 2, 4: 2, 5: 2,
            6: 3, 7: 3, 8: 3, 9: 3,
        },
        domClusterElement = {
            1: $('.cluster[data-num="1"]', args.inElement),
            2: $('.cluster[data-num="2"]', args.inElement),
            3: $('.cluster[data-num="3"]', args.inElement),
            4: $('.cluster[data-num="4"]', args.inElement),
            5: $('.cluster[data-num="5"]', args.inElement),
            6: $('.cluster[data-num="6"]', args.inElement).remove(),
            7: $('.cluster[data-num="7"]', args.inElement).remove(),
            8: $('.cluster[data-num="8"]', args.inElement).remove(),
            9: $('.cluster[data-num="9"]', args.inElement).remove(),
        },
        domFieldElement = {
            1: $('.field-1', args.inElement),
            2: $('.field-2', args.inElement),
            3: $('.field-3', args.inElement),
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

    function initImages(glyphData) {
        var glyphImages = {};

        // Preload cluster images (so that script works even offline).
        bodyElement.append(
            '<div class="hide">' +
                Object.keys(glyphData).map(function (glyphType) {
                    var html = '';
                    glyphData[glyphType].forEach(function (image) {
                        if (typeof image === 'string') { return; }
                        if (image[0]) {
                            html += '<img src="pic/' + image[0] + '.svg">';
                        }
                        if (image[3]) {
                            html += '<img src="pic/hand/' + image[3] + '.png">';
                        }
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
                    var svgName = value[0], shortkey = value[2],
                        html = '<img src="pic/' + svgName + '.svg">';
                    glyphImages[glyphType][shortkey] = html;
                });
        });
        return glyphImages;
    }

    // Return jQuery element for a new clusterType without displaying it in the
    // GUI. DOM elements for clusters in field I & II are reused, while
    // elements for clusters in field III are added.
    function initGlyph(clusterNum) {
        var element, fieldType = fieldNameOf[clusterNum], glyphElements;
        if (fieldType === 1 || fieldType === 2) {
            element = domClusterElement[clusterNum]; // reuse existing DOM element
        } else if (fieldType === 3) {                // create new DOM element
            element = domClusterElement[clusterNum].clone();
            domFieldElement[3].append(element);
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
            glyphTypes.forEach(function (glyphType) {
                var glyphChr       = glyphNumChrMap[glyphType][0],
                    glyphHtml      = glyphImages[glyphType][glyphChr],
                    clusterElement = domClusterElement[clusterNum];
                $('.' + glyphType, clusterElement).html(glyphHtml);
            });
        });
        domFieldElement[1].children('.cluster').addClass('hide');
        domFieldElement[2].children('.cluster').addClass('hide');
        domFieldElement[3].children('.cluster').remove();
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

        glyphChars.forEach(function (glyphChr, index) {
            var glyphType = glyphTypes[index],
                html  = glyphImages[glyphType][glyphChr] || glyphChr,
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
            var menuSpec = glyphData[glyphType],
                glyphNum = clusterGlyphNums[clusterNum][glyphType],
                startGlyphStr = cluster.getStr()[glyphNum];

            selectGlyph(menuSpec, startGlyphStr, function (value) {
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

    // Hide specified cluster in GUI. (For clusters in field I and II, hide the
    // cluster without removing it from the DOM, for clusters in field III the
    // cluster is removed from the DOM.)
    function hide(clusterElement) {
        var fieldElement = clusterElement.closest('.field', args.inElement);
        uncue();

        if (fieldElement.length === 0) {       // cluster not in
            return false;                      //    transcription field
        }
        if (fieldElement.hasClass('field-3')) {// field III
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
        [1, 2, 3].forEach(function (fieldType) {
            hideEmptyFieldElement(domFieldElement[fieldType]);
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
            clusterElement = domClusterElement[clusterNum],
            isHidden       = clusterElement.hasClass('hide');

        if (fieldType === 3) {
            clusterElement = gui.init(clusterNum).
                addClass('cue').removeClass('hide');
            cueRemove[clusterNum] = function () { gui.hide(clusterElement); };
            showParentFieldElement(clusterElement);
            return self;
        }

        if (fieldType !== 1 && fieldType !== 2) {
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

    function selectGlyph(menu, startGlyphStr, callback) {
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
                    var svgName  = value[0],   // glyph image
                        text     = value[1],   // handshape name
                        shortkey = value[2],   // shortkey
                        pngName  = value[3],   // handshape image
                        shortkeyHtml = '<td class="right shortkey">' +
                            (shortkey.match(/^[A-Z]$/) ? 'Shift+' : '') +
                            shortkey.toUpperCase()
                    shortkeys[shortkey] = index;
                    tableHtml += '<tr tabindex=1 data-num=' + index + ' ' +
                        'data-value="' + escapeHtml(shortkey) + '"' +
                        (startGlyphStr === shortkey ? ' class=selected' : '') + '>' +
                        '<td class=' + cssClass + '>' +
                        '<img src="pic/' + svgName + '.svg">' +
                        '<td>' +
                        (pngName ? '<img src="pic/hand/' + pngName + '.png">' : '') +
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

        dragula($('.field-1', args.inElement).toArray(), {
            direction: 'horizontal',
            removeOnSpill: true,
            accepts: noPositionChange,
        }).
            on('drag',   enumerateDragElementsAndRemeberSibling).
            on('remove', removeCluster).
            on('dragend', removeFieldDragClass);

        dragula($('.field-2', args.inElement).toArray(), {
            direction: 'horizontal',
            removeOnSpill: true,
            accepts: noPositionChange,
        }).
            on('drag',   enumerateDragElementsAndRemeberSibling).
            on('remove', removeCluster).
            on('dragend', removeFieldDragClass);

        dragula($('.field-3', args.inElement).toArray(), {
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
