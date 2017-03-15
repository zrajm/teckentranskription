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
                ["h-flata-handen.svg",     "Flata handen",     "j", "hand/flata-handen.jpg"     ],
                ["h-flata-tumhanden.svg",  "Flata tumhanden",  "J", "hand/flata-tumhanden.jpg"  ],
                ["h-sprethanden.svg",      "Sprethanden",      "y", "hand/sprethanden.jpg"      ],
                ["h-4-handen.svg",         "4-handen",         "D", "hand/4-handen.jpg"         ],
                ["h-d-handen.svg",         "D-handen",         "d", "hand/d-handen.jpg"         ],
                ["h-f-handen.svg",         "F-handen",         "f", "hand/f-handen.jpg"         ],
                ["h-vinkelhanden.svg",     "Vinkelhanden",     "F", "hand/vinkelhanden.jpg"     ],
                ["h-tumvinkelhanden.svg",  "Tumvinkelhanden",  "A", "hand/tumvinkelhanden.jpg"  ],
                ["h-a-handen.svg",         "A-handen",         "a", "hand/a-handen.jpg"         ],
                ["h-s-handen.svg",         "S-handen",         "s", "hand/s-handen.jpg"         ],
                ["h-klohanden.svg",        "Klohanden",        "S", "hand/klohanden.jpg"        ],
                ["h-o-handen.svg",         "O-handen",         "o", "hand/o-handen.jpg"         ],
                ["h-knutna-handen.svg",    "Knutna handen",    "g", "hand/knutna-handen.jpg"    ],
                ["h-e-handen.svg",         "E-handen",         "e", "hand/e-handen.jpg"         ],
                ["h-tumhanden.svg",        "Tumhanden",        "b", "hand/tumhanden.jpg"        ],
                ["h-q-handen.svg",         "Q-handen",         "q", "hand/q-handen.jpg"         ],
                ["h-pekfingret.svg",       "Pekfingret",       "l", "hand/pekfingret.jpg"       ],
                ["h-l-handen.svg",         "L-handen",         "L", "hand/l-handen.jpg"         ],
                ["h-raka-matthanden.svg",  "Raka måtthanden",  "C", "hand/raka-matthanden.jpg"  ],
                ["h-nyphanden.svg",        "Nyphanden",        "P", "hand/nyphanden.jpg"        ],
                ["h-t-handen.svg",         "T-handen",         "t", "hand/t-handen.jpg"         ],
                ["h-krokfingret.svg",      "Krokfingret",      "R", "hand/krokfingret.jpg"      ],
                ["h-matthanden.svg",       "Måtthanden",       "c", "hand/matthanden.jpg"       ],
                ["h-hallhanden.svg",       "Hållhanden",       "O", "hand/hallhanden.jpg"       ],
                ["h-langfingret.svg",      "Långfingret",      "r", "hand/langfingret.jpg"      ],
                ["h-n-handen.svg",         "N-handen",         "n", "hand/n-handen.jpg"         ],
                ["h-lilla-o-handen.svg",   "Lilla O-handen",   "p", "hand/lilla-o-handen.jpg"   ],
                ["h-v-handen.svg",         "V-handen",         "v", "hand/v-handen.jpg"         ],
                ["h-tupphanden.svg",       "Tupphanden",       "V", "hand/tupphanden.jpg"       ],
                ["h-k-handen.svg",         "K-handen",         "k", "hand/k-handen.jpg"         ],
                ["h-dubbelkroken.svg",     "Dubbelkroken",     "u", "hand/dubbelkroken.jpg"     ],
                ["h-bojda-tupphanden.svg", "Böjda tupphanden", "U", "hand/bojda-tupphanden.jpg" ],
                ["h-m-handen.svg",         "M-handen",         "m", "hand/m-handen.jpg"         ],
                ["h-w-handen.svg",         "W-handen",         "w", "hand/w-handen.jpg"         ],
                ["h-lillfingret.svg",      "Lillfingret",      "i", "hand/lillfingret.jpg"      ],
                ["h-flyghanden.svg",       "Flyghanden",       "I", "hand/flyghanden.jpg"       ],
                ["h-stora-langfingret.svg","Stora långfingret","Y", "hand/stora-langfingret.jpg"],
                ["h-runda-langfingret.svg","Runda långfingret","Z", "hand/runda-langfingret.jpg"],
                ["h-stora-nyphanden.svg",  "Stora nyphanden",  "h", "hand/stora-nyphanden.jpg"  ],
                ["h-x-handen.svg",         "X-handen",         "x", "hand/x-handen.jpg"         ],
            ],
            ar: [
                "Attitydsriktning",                       // Cannot be combined with:
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
                ["i-kors.svg",    "Kors",    "x"],
                ["i-vinkel.svg",  "Vinkel",  "w"],
                ["i-hakning.svg", "Hakning", "X"],
            ],
            artion_tall: [ // Artikulation
                "Rörelseriktning",
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
                ["i-medial-kontakt.svg", "Medial kontakt",                ","],
                "Övrigt",
                ["x-upprepning.svg", "Upprepad artikulation",             ":"],
                ["x-separator.svg",  "Markerar sekventiell artikulation", "!"],
            ],
            artion_high: [ // Artikulation
                "Rörelseart",
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
        clusterGlyphs = {
            ia  : { r: glyphData.r, a: glyphData.a },
            ib  : { r: glyphData.r, h: glyphData.h, ar: glyphData.ar, av: glyphData.av },
            iia : { ar: glyphData.ar, av: glyphData.av, r: glyphData.r, h: glyphData.h },
            iib : { ina: glyphData.ina },
            iic : { h: glyphData.h, ar: glyphData.ar, av: glyphData.av },
            iiia: { artion_tall: glyphData.artion_tall },
            iiib: { artion_high: glyphData.artion_high, artion_low: glyphData.artion_low },
            iiic: { h: glyphData.h },
        },
        cueRemove   = {},
        glyphImages = initImages(glyphData),
        fieldNameOf = {
            ia:   'i',   ib:   'i',
            iia:  'ii',  iib:  'ii',  iic:  'ii',
            iiia: 'iii', iiib: 'iii', iiic: 'iii'
        },
        domElement = (function () {
            // Function returning jQuery element for cluster or field.
            var elements = {
                i   : $('.field.i',      args.inElement),
                ii  : $('.field.ii',     args.inElement),
                iii : $('.field.iii',    args.inElement),
                ia  : $('.cluster.ia',   args.inElement),
                ib  : $('.cluster.ib',   args.inElement),
                iia : $('.cluster.iia',  args.inElement),
                iib : $('.cluster.iib',  args.inElement),
                iic : $('.cluster.iic',  args.inElement),
                iiia: $('.cluster.iiia', args.inElement).remove(),
                iiib: $('.cluster.iiib', args.inElement).remove(),
                iiic: $('.cluster.iiic', args.inElement).remove()
            };
            return function (clusterOrFieldType) {
                return elements[clusterOrFieldType];
            };
        }());

    function initImages(glyphData) {
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
    function initGlyph(clusterType) {
        var element, fieldType = fieldNameOf[clusterType], glyphElements;
        if (fieldType === 'i' || fieldType === 'ii') {
            element = domElement(clusterType); // reuse existing DOM element
        } else if (fieldType === 'iii') {      // create new DOM element
            element = domElement(clusterType).clone();
            domElement('iii').append(element);
        } else {
            throw TypeError("Invalid cluster type '" + clusterType + "'");
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
        var clusterTypes = Object.keys(fieldNameOf);
        clusterTypes.forEach(function (clusterType) {
            var glyphTypes = Object.keys(clusterGlyphs[clusterType]);
            glyphTypes.forEach(function (glyphType) {
                var glyphHtml      = glyphImages[glyphType][0],
                    clusterElement = domElement(clusterType);
                $('.' + glyphType, clusterElement).html(glyphHtml);
            });
        });
        domElement('i')  .children('.cluster').addClass('hide');
        domElement('ii') .children('.cluster').addClass('hide');
        domElement('iii').children('.cluster').remove();
        hideAllEmptyFieldElements();
    }

    // Populate specified cluster table (in DOM) with values.
    function set(cluster) {
        var clusterType    = cluster.get('type'),
            clusterElement = cluster.get('_element'),
            glyphTypes     = Object.keys(clusterGlyphs[clusterType]);

        if (clusterElement === undefined) {
            throw TypeError("Missing '_element' property in cluster");
        }
        if (clusterType === undefined) {
            throw TypeError("Missing 'type' property in cluster");
        }
        if (clusterGlyphs[clusterType] === undefined) {
            throw TypeError("Invalid cluster type '" + clusterType + "'");
        }

        glyphTypes.forEach(function (glyphType) {
            var value = cluster.get(glyphType) || 0,
                html  = glyphImages[glyphType][value] || value,
                glyph = $('.' + glyphType, clusterElement);
            glyph.html(html);
            // Special case for 'medial contact' and 'separator' glyphs.
            // (Bottom aligned using CSS class 'low'.)
            if (html.match(/\/(i-medial-kontakt|x-separator)\.svg"/)) {
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
        var clusterType    = cluster.get('type'),
            clusterElement = cluster.get('_element'),
            glyphTypes     = Object.keys(clusterGlyphs[clusterType]);

        uncue();
        if (!clusterElement.hasClass('hide')) { return; }

        clusterElement.                        // cluster + field element
            add(clusterElement.closest('.field', args.inElement)).
            removeClass('cue hide');

        function glyphMenu(glyphType) {
            var menuSpec     = glyphData[glyphType],
                currentValue = cluster.get(glyphType);

            selectGlyph(menuSpec, currentValue, function (value) {
                cluster.set(glyphType, value);
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
            hideEmptyFieldElement(domElement(fieldType));
        });
    }

    function hideEmptyFieldElement(fieldElement) {
        var clusterCount = $('.cluster:not(.hide)', fieldElement).length;
        if (clusterCount === 0) {
            fieldElement.addClass('hide');
        }
    }

    // Cue change to specified cluster. (Works with all clusters.)
    function cue(clusterType) {
        var fieldType      = fieldNameOf[clusterType],
            clusterElement = domElement(clusterType),
            isHidden       = clusterElement.hasClass('hide');

        if (fieldType === 'iii') {
            clusterElement = gui.init(clusterType).
                addClass('cue').removeClass('hide');
            cueRemove[clusterType] = function () { gui.hide(clusterElement); };
            showParentFieldElement(clusterElement);
            return self;
        }

        if (fieldType !== 'i' && fieldType !== 'ii') {
            throw TypeError("Invalid cluster type '" + clusterType + "' " +
                "(only type I & II can be previewed)");
        }

        // Visible already = do nada.
        if (!isHidden) { return self; }

        uncue(clusterType);
        cueRemove[clusterType] = isHidden ?    // setup cue removal function
            function () {                      //   hide again + remove cue
                clusterElement.addClass('hide').removeClass('cue');
            } :
            function () {                     //    show again + remove cue
                clusterElement.removeClass('hide cue');
            };

        clusterElement.addClass('cue').removeClass('hide');
        showParentFieldElement(clusterElement);
        return self;
    }

    function isHidden(clusterType) {
        return domElement(clusterType).hasClass('hide');
    }

    // Undo the effects of any currently active cue.
    function uncue(clusterType) {
        var clusterTypes = clusterType ?
            [ clusterType ] : Object.keys(cueRemove);
        clusterTypes.forEach(function (clusterType) {
            var f = cueRemove[clusterType];
            if (typeof f === 'function') {
                delete cueRemove[clusterType];
                return f();
            }
        });
        hideAllEmptyFieldElements();
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Glyph Selector Menu
    //

    function selectGlyph(menu, selectedValue, callback) {
        var tableElement    = $('table', overlayElement),
            selectedElement = $(document.activeElement),
            selectedValue   = selectedValue || 0,
            rowElements;
        overlayActive = true;

        function createMenu(menu) {
            var shortkeys = {}, index = 0,
                tableHtml = "", url   = window.location.href;
            bodyElement.addClass('overlay');
            windowElement.on('popstate', destroyMenu);
            history.pushState({}, document.title + ": Select Glyph",
                              url + (url.match(/#/) ? '' : '#' ) + '?menu');

            menu.forEach(function (value) {
                if (typeof value === 'string') {
                    tableHtml += '<tr><th colspan=4>' + value;
                } else {
                    var glyph    = value[0],
                        text     = value[1],
                        shortkey = value[2],
                        image    = value[3],
                        shortkeyHtml = '';
                    shortkeys[shortkey] = index;
                    shortkeyHtml = '<td class="right shortkey">' +
                        (shortkey.match(/^[A-Z]$/) ? 'Shift+' : '') +
                        shortkey.toUpperCase()
                    tableHtml += '<tr tabindex=1 data-value=' + index +
                        (selectedValue === index ? ' class=selected' : '') + '>' +
                        '<td><img src="pic/' + glyph + '">' +
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
            rowElements[selectedValue].focus();
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
                    itemNum = element.data('value');

                // Let browser handle key combinations with Ctrl or Alt.
                if (event.altKey || event.ctrlKey) { return true; }

                if (shortkeys[event.key] !== undefined) {
                    itemNum = shortkeys[event.key];
                    destroyMenu(false, function () {
                        callback(itemNum);
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
                        callback(itemNum);
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
