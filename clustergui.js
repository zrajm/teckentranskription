/* Copyright 2017 by zrajm. Released under GPLv3 license. */

// This is a singleton module (i.e. should only be invoked once).
function makeClusterGui(args) {
    var self = {
            clear   : clear,
            cueHide : cueHide,
            cueShow : cueShow,
            hide    : hide,
            init    : initGlyph,
            isHidden: isHidden,
            set     : set,
            show    : show,
            uncue   : uncue,
        },
        transcriptElement = args.inElement,
        glyphData = {
            r: [ // Relation
                ["r-ingen.svg",   "Relation – Ingen"  ],
                ["r-over.svg",    "Relation – Över"   ],
                ["r-under.svg",   "Relation – Under"  ],
                ["r-bredvid.svg", "Relation – Bredvid"],
                ["r-framfor.svg", "Relation – Framför"],
                ["r-bakom.svg",   "Relation – Bakom"  ],
            ],
            a: [ // Artikulationsställe
                ["a-hjassan.svg",         "Läge – Hjässan"                        ],
                ["a-ansiktet.svg",        "Läge – Ansiktet, huvudhöjd"            ],
                ["a-ansiktet-upptill.svg","Läge – Ansiktet, övre del"             ],
                ["a-ansiktet-nertill.svg","Läge – Ansiktet, nedre del"            ],
                ["a-pannan.svg",          "Läge – Pannan"                         ],
                ["a-ogonen.svg",          "Läge – Ögonen"                         ],
                ["a-ogat.svg",            "Läge – Ögat"                           ],
                ["a-nasan.svg",           "Läge – Näsan"                          ],
                ["a-oronen.svg",          "Läge – Sidorna av huvudet, öronen"     ],
                ["a-orat-hoger.svg",      "Läge – Sidan av huvudet, örat, höger"  ],
                ["a-orat-vanster.svg",    "Läge – Sidan av huvudet, örat, vänster"],
                ["a-kinderna.svg",        "Läge – Kinderna"                       ],
                ["a-kinden-hoger.svg",    "Läge – Kinden, höger"                  ],
                ["a-kinden-vanster.svg",  "Läge – Kinden, vänster"                ],
                ["a-munnen.svg",          "Läge – Munnen"                         ],
                ["a-hakan.svg",           "Läge – Hakan"                          ],
                ["a-nacken.svg",          "Läge – Nacken"                         ],
                ["a-halsen.svg",          "Läge – Halsen"                         ],
                ["a-axlarna.svg",         "Läge – Axlarna"                        ],
                ["a-axeln-hoger.svg",     "Läge – Axeln, höger"                   ],
                ["a-axeln-vanster.svg",   "Läge – Axeln, vänster"                 ],
                ["a-armen.svg",           "Läge – Armen"                          ],
                ["a-overarmen.svg",       "Läge – Överarmen"                      ],
                ["a-underarmen.svg",      "Läge – Underarmen"                     ],
                ["a-brostet.svg",         "Läge – Bröstet"                        ],
                ["a-brostet-hoger.svg",   "Läge – Bröstet, höger sida"            ],
                ["a-brostet-vanster.svg", "Läge – Bröstet, vänster sida"          ],
                ["a-magen.svg",           "Läge – Magen, mellangärdet"            ],
                ["a-hofterna.svg",        "Läge – Höfterna"                       ],
                ["a-hoften-hoger.svg",    "Läge – Höften, höger"                  ],
                ["a-hoften-vanster.svg",  "Läge – Höften, vänster"                ],
                ["a-benet.svg",           "Läge – Benet"                          ],
            ],
            h: [ // Handform
                //
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
                //
                ["h-flata-handen.svg",     "Handform – Flata handen",     "j", "hand/flata-handen.jpg"     ],
                ["h-flata-tumhanden.svg",  "Handform – Flata tumhanden",  "J", "hand/flata-tumhanden.jpg"  ],
                ["h-sprethanden.svg",      "Handform – Sprethanden",      "y", "hand/sprethanden.jpg"      ],
                ["h-4-handen.svg",         "Handform – 4-handen",         "D", "hand/4-handen.jpg"         ],
                ["h-d-handen.svg",         "Handform – D-handen",         "d", "hand/d-handen.jpg"         ],
                ["h-f-handen.svg",         "Handform – F-handen",         "f", "hand/f-handen.jpg"         ],
                ["h-vinkelhanden.svg",     "Handform – Vinkelhanden",     "F", "hand/vinkelhanden.jpg"     ],
                ["h-tumvinkelhanden.svg",  "Handform – Tumvinkelhanden",  "A", "hand/tumvinkelhanden.jpg"  ],
                ["h-a-handen.svg",         "Handform – A-handen",         "a", "hand/a-handen.jpg"         ],
                ["h-s-handen.svg",         "Handform – S-handen",         "s", "hand/s-handen.jpg"         ],
                ["h-klohanden.svg",        "Handform – Klohanden",        "S", "hand/klohanden.jpg"        ],
                ["h-o-handen.svg",         "Handform – O-handen",         "o", "hand/o-handen.jpg"         ],
                ["h-knutna-handen.svg",    "Handform – Knutna handen",    "g", "hand/knutna-handen.jpg"    ],
                ["h-e-handen.svg",         "Handform – E-handen",         "e", "hand/e-handen.jpg"         ],
                ["h-tumhanden.svg",        "Handform – Tumhanden",        "b", "hand/tumhanden.jpg"        ],
                ["h-q-handen.svg",         "Handform – Q-handen",         "q", "hand/q-handen.jpg"         ],
                ["h-pekfingret.svg",       "Handform – Pekfingret",       "l", "hand/pekfingret.jpg"       ],
                ["h-l-handen.svg",         "Handform – L-handen",         "L", "hand/l-handen.jpg"         ],
                ["h-raka-matthanden.svg",  "Handform – Raka måtthanden",  "C", "hand/raka-matthanden.jpg"  ],
                ["h-nyphanden.svg",        "Handform – Nyphanden",        "P", "hand/nyphanden.jpg"        ],
                ["h-t-handen.svg",         "Handform – T-handen",         "t", "hand/t-handen.jpg"         ],
                ["h-krokfingret.svg",      "Handform – Krokfingret",      "R", "hand/krokfingret.jpg"      ],
                ["h-matthanden.svg",       "Handform – Måtthanden",       "c", "hand/matthanden.jpg"       ],
                ["h-hallhanden.svg",       "Handform – Hållhanden",       "O", "hand/hallhanden.jpg"       ],
                ["h-langfingret.svg",      "Handform – Långfingret",      "r", "hand/langfingret.jpg"      ],
                ["h-n-handen.svg",         "Handform – N-handen",         "n", "hand/n-handen.jpg"         ],
                ["h-lilla-o-handen.svg",   "Handform – Lilla O-handen",   "p", "hand/lilla-o-handen.jpg"   ],
                ["h-v-handen.svg",         "Handform – V-handen",         "v", "hand/v-handen.jpg"         ],
                ["h-tupphanden.svg",       "Handform – Tupphanden",       "V", "hand/tupphanden.jpg"       ],
                ["h-k-handen.svg",         "Handform – K-handen",         "k", "hand/k-handen.jpg"         ],
                ["h-dubbelkroken.svg",     "Handform – Dubbelkroken",     "u", "hand/dubbelkroken.jpg"     ],
                ["h-bojda-tupphanden.svg", "Handform – Böjda tupphanden", "U", "hand/bojda-tupphanden.jpg" ],
                ["h-m-handen.svg",         "Handform – M-handen",         "m", "hand/m-handen.jpg"         ],
                ["h-w-handen.svg",         "Handform – W-handen",         "w", "hand/w-handen.jpg"         ],
                ["h-lillfingret.svg",      "Handform – Lillfingret",      "i", "hand/lillfingret.jpg"      ],
                ["h-flyghanden.svg",       "Handform – Flyghanden",       "I", "hand/flyghanden.jpg"       ],
                ["h-stora-langfingret.svg","Handform – Stora långfingret","Y", "hand/stora-langfingret.jpg"],
                ["h-runda-langfingret.svg","Handform – Runda långfingret","Z", "hand/runda-langfingret.jpg"],
                ["h-stora-nyphanden.svg",  "Handform – Stora nyphanden",  "h", "hand/stora-nyphanden.jpg"  ],
                ["h-x-handen.svg",         "Handform – X-handen",         "x", "hand/x-handen.jpg"         ],
            ],
            ar: [ // Attitydsriktning                                            // Cannot be combined with:
                ["ar-vanster.svg", "Attitydsriktning – Vänsterriktad", "v"], //   höger- & vänstervänd
                ["ar-hoger.svg",   "Attitydsriktning – Högerriktad",   "h"], //   -"-
                ["ar-fram.svg",    "Attitydsriktning – Framåtriktad",  "f"], //   framåt- & inåtriktad
                ["ar-in.svg",      "Attitydsriktning – Inåtriktad",    "i"], //   -"-
                ["ar-upp.svg",     "Attitydsriktning – Uppåtriktad",   "u"], //   uppåt- & nedåtvänd
                ["ar-ner.svg",     "Attitydsriktning – Nedåtriktad",   "n"], //   -"-
            ],
            av: [ // Attitydsvridning                                            // Cannot be combined with:
                ["av-vanster.svg", "Attitydsvridning – Vänstervänd", "v"],   //   höger- & vänsterriktad
                ["av-hoger.svg",   "Attitydsvridning – Högervänd",   "h"],   //   -"-
                ["av-fram.svg",    "Attitydsvridning – Framåtvänd",  "f"],   //   framåt- & inåtriktad
                ["av-in.svg",      "Attitydsvridning – Inåtvänd",    "i"],   //   -"-
                ["av-upp.svg",     "Attitydsvridning – Uppåtvänd",   "u"],   //   uppåt- & nedåtriktad
                ["av-ner.svg",     "Attitydsvridning – Nedåtvänd",   "n"],   //   -"-
            ],
            ina: [ // Interaktionsart
                ["i-kors.svg",    "Interaktionsart – Kors",    "x"],
                ["i-vinkel.svg",  "Interaktionsart – Vinkel",  "w"],
                ["i-hakning.svg", "Interaktionsart – Hakning", "X"],
            ],
            artion_tall: [ // Artikulation
                ["rr-vanster.svg",      "Rörelseriktning – Föres åt vänster",             "v"],
                ["rr-hoger.svg",        "Rörelseriktning – Föres åt höger",               "h"],
                ["rr-vanster-hoger.svg","Rörelseriktning – Föres vänster–höger (sidled)", "s"],
                ["rr-fram.svg",         "Rörelseriktning – Föres framåt",                 "f"],
                ["rr-in.svg",           "Rörelseriktning – Föres inåt",                   "i"],
                ["rr-fram-in.svg",      "Rörelseriktning – Föres framåt–inåt (djupled)",  "d"],
                ["rr-upp.svg",          "Rörelseriktning – Föres uppåt",                  "u"],
                ["rr-ner.svg",          "Rörelseriktning – Föres nedåt",                  "n"],
                ["rr-upp-ner.svg",      "Rörelseriktning – Föres uppåt–nedåt (höjdled)",  "j"],
                ["rr-kort-upp.svg",     "Rörelseriktning – Föres kort uppåt",             "U"],
                ["rr-kort-ner.svg",     "Rörelseriktning – Föres kort nedåt",             "N"],
                ["ra-spelar.svg",       "Rörelseart – Spelar",                            "~"],
                ["ra-stror.svg",        "Rörelseart – Strör",                             "@"],
                ["ra-vinkar.svg",       "Rörelseart – Vinkar",                            "#"],
                ["ra-bojs.svg",         "Rörelseart – Böjs",                              '"'],
                ["i-vaxelvis.svg",      "Interaktionsart – Växelvis",                     "="],
                ["i-konvergerar.svg",   "Interaktionsart – Konvergerar",                  ">"],
                ["i-divergerar.svg",    "Interaktionsart – Divergerar",                   "<"],
                ["i-byte.svg",          "Interaktionsart – Byte",                         "'"],
                ["i-kors.svg",          "Interaktionsart – Kors",                         "x"],
                ["i-vinkel.svg",        "Interaktionsart – Vinkel",                       "w"],
                ["i-hakning.svg",       "Interaktionsart – Hakning",                      "X"],
                ["i-entre.svg",         "Interaktionsart – Entré",                        "e"],
                ["i-kontakt.svg",       "Interaktionsart – Kontakt",                      "."],
                ["i-medial-kontakt.svg","Interaktionsart – Medial kontakt",               ","],
                ["x-upprepning.svg",    "Övrigt – Upprepad artikulation",                 ":"],
                ["x-separator.svg",     "Övrigt – Markerar sekventiell artikulation",     "|"],
            ],
            artion_high: [ // Artikulation
                ["ra-bage.svg",   "Rörelseart – Båge",   "b"],
                ["ra-cirkel.svg", "Rörelseart – Cirkel", "c"],
                ["ra-vrids.svg",  "Rörelseart – Vrids",  "v"],
                ["ra-slas.svg",   "Rörelseart – Slås",   "s"],
            ],
            artion_low: [ // Artikulation
                ["rr-vanster2.svg",       "Rörelseriktning – Åt vänster",             "v"],
                ["rr-hoger2.svg",         "Rörelseriktning – Åt höger",               "h"],
                ["rr-vanster-hoger2.svg", "Rörelseriktning – Vänster–höger (sidled)", "s"],
                ["rr-fram2.svg",          "Rörelseriktning – Framåt",                 "f"],
                ["rr-in2.svg",            "Rörelseriktning – Inåt",                   "i"],
                ["rr-fram-in2.svg",       "Rörelseriktning – Framåt–inåt (djupled)",  "d"],
                ["rr-fixme.svg",          "Rörelseriktning – FIXME",                  "m"],
                ["rr-upp2.svg",           "Rörelseriktning – Uppåt",                  "u"],
                ["rr-ner2.svg",           "Rörelseriktning – Nedåt",                  "n"],
                ["rr-upp-ner2.svg",       "Rörelseriktning – Uppåt–nedåt (höjdled)",  "j"],
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
                i   : $('.field.i',      transcriptElement),
                ii  : $('.field.ii',     transcriptElement),
                iii : $('.field.iii',    transcriptElement),
                ia  : $('.cluster.ia',   transcriptElement),
                ib  : $('.cluster.ib',   transcriptElement),
                iia : $('.cluster.iia',  transcriptElement),
                iib : $('.cluster.iib',  transcriptElement),
                iic : $('.cluster.iic',  transcriptElement),
                iiia: $('.cluster.iiia', transcriptElement).remove(),
                iiib: $('.cluster.iiib', transcriptElement).remove(),
                iiic: $('.cluster.iiic', transcriptElement).remove()
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
                        if (image[0]) { html += '<img src="pic/' + image[0] + '">'; }
                        if (image[3]) { html += '<img src="pic/' + image[3] + '">'; }
                    });
                    return html;
                }).join('') + '</div>');

        Object.keys(glyphData).forEach(function (glyphType) {
            var glyphList = glyphData[glyphType];
            glyphImages[glyphType] = {};
            glyphList.forEach(function (value, index) {
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
            glyphElements = element.find('.glyph').off('hover focus');
            if (args.onGlyphHover) { glyphElements.hover(args.onGlyphHover); }
            if (args.onGlyphFocus) { glyphElements.focus(args.onGlyphFocus); }
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
                html  = glyphImages[glyphType][value] || value;
            $('.' + glyphType, clusterElement).html(html);
        });

        return self;                           // chainable
    }

    // Show cluster in GUI. Return jQuery element for the shown cluster.
    //
    // CSS classes 'cuehide'/'cueshow' are used to indicate the cue modes.
    function show(cluster) {
        var clusterType    = cluster.get('type'),
            clusterElement = cluster.get('_element'),
            glyphTypes     = Object.keys(clusterGlyphs[clusterType]);

        uncue();
        if (!clusterElement.hasClass('hide')) { return; }

        clusterElement.                        // cluster + field element
            add(clusterElement.closest('.field', transcriptElement)).
            removeClass('cueshow cuehide hide');

        function glyphMenu(glyphType) {
            var menuSpec     = glyphData[glyphType],
                currentValue = cluster.get(glyphType);

            selectGlyph(menuSpec, currentValue, function (value) {
                cluster.set(glyphType, value);
            });
        }

        glyphTypes.forEach(function (glyphType) {
            $('.' + glyphType, clusterElement).
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
        var fieldElement = clusterElement.closest('.field', transcriptElement);
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
        var fieldElement = clusterElement.closest('.field', transcriptElement);
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

    // Cue change to specified cluster. ('cuehide' is only applicable to
    // clusters of type I and II, while 'cueshow' works with all clusters.)
    // `cssClass` can be either 'cueshow' or 'cuehide'.
    function cue(clusterType, cssClass) {
        var fieldType      = fieldNameOf[clusterType],
            clusterElement = domElement(clusterType),
            isHidden       = clusterElement.hasClass('hide');

        if (fieldType === 'iii' && cssClass === 'cueshow') {
            var element = gui.init(clusterType).
                addClass('cueshow').removeClass('hide');
            cueRemove[clusterType] = function () { gui.hide(element); };
            return self;
        }

        if (fieldType !== 'i' && fieldType !== 'ii') {
            throw TypeError("Invalid cluster type '" + clusterType + "' " +
                "(only type I & II can be previewed)");
        }

        // Hidden = do nada.
        if (cssClass === 'cuehide' && isHidden) { return self; }

        // Visible = preview for removal.
        if (cssClass === 'cueshow' && !isHidden) { cssClass = 'cuehide'; }

        uncue(clusterType);
        cueRemove[clusterType] = isHidden ?    // setup cue removal function
            function () {                      //   hide again + remove cue
                clusterElement.addClass('hide').removeClass(cssClass);
            } :
            function () {                     //    show again + remove cue
                clusterElement.removeClass('hide ' + cssClass);
            };

        clusterElement.addClass(cssClass).removeClass('hide');
        showParentFieldElement(clusterElement);
        return self;
    }

    function cueShow(clusterType) { return cue(clusterType, 'cueshow'); }
    function cueHide(clusterType) { return cue(clusterType, 'cuehide'); }

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

    clear();
    return self;
}

//[eof]
