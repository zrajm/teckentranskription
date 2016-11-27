/* Copyright 2016 by zrajm. Released under GPLv3 license. */

var addIaButtonElement  = $("#ia")
    addIbButtonElement  = $("#ib")
    addIIaButtonElement = $("#iia")
    addIIbButtonElement = $("#iib")
    addIIcButtonElement = $("#iic")
    addIIIaButtonElement = $("#iiia")
    addIIIbButtonElement = $("#iiib")
    addIIIcButtonElement = $("#iiic")
    loadButtonElement   = $("#load"),
    loadInputElement    = $("#load-input"),
    saveButtonElement   = $("#save"),
    saveInputElement    = $("#save-input"),
    dumpButtonElement   = $("#dump"),
    clearButtonElement  = $("#clear"),
    deleteButtonElement = $("#delete"),
    overlayElement      = $("#overlay"),
    inputElement        = $("#input"),
    statusElement       = $("#status"),
    glyphs = {
        r: [ // Relation
            ["pic/r-ingen.svg",   "Relation – Ingen"  ],
            ["pic/r-over.svg",    "Relation – Över"   ],
            ["pic/r-under.svg",   "Relation – Under"  ],
            ["pic/r-bredvid.svg", "Relation – Bredvid"],
            ["pic/r-framfor.svg", "Relation – Framför"],
            ["pic/r-bakom.svg",   "Relation – Bakom"  ],
        ],
        a: [ // Artikulationsställe
            ["pic/a-hjassan.svg",         "Läge – Hjässan"                        ],
            ["pic/a-ansiktet.svg",        "Läge – Ansiktet, huvudhöjd"            ],
            ["pic/a-ansiktet-upptill.svg","Läge – Ansiktet, övre del"             ],
            ["pic/a-ansiktet-nertill.svg","Läge – Ansiktet, nedre del"            ],
            ["pic/a-pannan.svg",          "Läge – Pannan"                         ],
            ["pic/a-ogonen.svg",          "Läge – Ögonen"                         ],
            ["pic/a-ogat.svg",            "Läge – Ögat"                           ],
            ["pic/a-nasan.svg",           "Läge – Näsan"                          ],
            ["pic/a-oronen.svg",          "Läge – Sidorna av huvudet, öronen"     ],
            ["pic/a-orat-hoger.svg",      "Läge – Sidan av huvudet, örat, höger"  ],
            ["pic/a-orat-vanster.svg",    "Läge – Sidan av huvudet, örat, vänster"],
            ["pic/a-kinderna.svg",        "Läge – Kinderna"                       ],
            ["pic/a-kinden-hoger.svg",    "Läge – Kinden, höger"                  ],
            ["pic/a-kinden-vanster.svg",  "Läge – Kinden, vänster"                ],
            ["pic/a-munnen.svg",          "Läge – Munnen"                         ],
            ["pic/a-hakan.svg",           "Läge – Hakan"                          ],
            ["pic/a-nacken.svg",          "Läge – Nacken"                         ],
            ["pic/a-halsen.svg",          "Läge – Halsen"                         ],
            ["pic/a-axlarna.svg",         "Läge – Axlarna"                        ],
            ["pic/a-axeln-hoger.svg",     "Läge – Axeln, höger"                   ],
            ["pic/a-axeln-vanster.svg",   "Läge – Axeln, vänster"                 ],
            ["pic/a-armen.svg",           "Läge – Armen"                          ],
            ["pic/a-overarmen.svg",       "Läge – Överarmen"                      ],
            ["pic/a-underarmen.svg",      "Läge – Underarmen"                     ],
            ["pic/a-brostet.svg",         "Läge – Bröstet"                        ],
            ["pic/a-brostet-hoger.svg",   "Läge – Bröstet, höger sida"            ],
            ["pic/a-brostet-vanster.svg", "Läge – Bröstet, vänster sida"          ],
            ["pic/a-magen.svg",           "Läge – Magen, mellangärdet"            ],
            ["pic/a-hofterna.svg",        "Läge – Höfterna"                       ],
            ["pic/a-hoften-hoger.svg",    "Läge – Höften, höger"                  ],
            ["pic/a-hoften-vanster.svg",  "Läge – Höften, vänster"                ],
            ["pic/a-benet.svg",           "Läge – Benet"                          ],
        ],
        h: [ // Handform
            ["pic/h-flata-handen.svg",     "Handform – Flata handen",     "pic/hand/flata-handen.jpg"     ],
            ["pic/h-flata-tumhanden.svg",  "Handform – Flata tumhanden",  "pic/hand/flata-tumhanden.jpg"  ],
            ["pic/h-sprethanden.svg",      "Handform – Sprethanden",      "pic/hand/sprethanden.jpg"      ],
            ["pic/h-4-handen.svg",         "Handform – 4-handen",         "pic/hand/4-handen.jpg"         ],
            ["pic/h-d-handen.svg",         "Handform – D-handen",         "pic/hand/d-handen.jpg"         ],
            ["pic/h-f-handen.svg",         "Handform – F-handen",         "pic/hand/f-handen.jpg"         ],
            ["pic/h-vinkelhanden.svg",     "Handform – Vinkelhanden",     "pic/hand/vinkelhanden.jpg"     ],
            ["pic/h-tumvinkelhanden.svg",  "Handform – Tumvinkelhanden",  "pic/hand/tumvinkelhanden.jpg"  ],
            ["pic/h-a-handen.svg",         "Handform – A-handen",         "pic/hand/a-handen.jpg"         ],
            ["pic/h-s-handen.svg",         "Handform – S-handen",         "pic/hand/s-handen.jpg"         ],
            ["pic/h-klohanden.svg",        "Handform – Klohanden",        "pic/hand/klohanden.jpg"        ],
            ["pic/h-o-handen.svg",         "Handform – O-handen",         "pic/hand/o-handen.jpg"         ],
            ["pic/h-knutna-handen.svg",    "Handform – Knutna handen",    "pic/hand/knutna-handen.jpg"    ],
            ["pic/h-e-handen.svg",         "Handform – E-handen",         "pic/hand/e-handen.jpg"         ],
            ["pic/h-tumhanden.svg",        "Handform – Tumhanden",        "pic/hand/tumhanden.jpg"        ],
            ["pic/h-q-handen.svg",         "Handform – Q-handen",         "pic/hand/q-handen.jpg"         ],
            ["pic/h-pekfingret.svg",       "Handform – Pekfingret",       "pic/hand/pekfingret.jpg"       ],
            ["pic/h-l-handen.svg",         "Handform – L-handen",         "pic/hand/l-handen.jpg"         ],
            ["pic/h-raka-matthanden.svg",  "Handform – Raka måtthanden",  "pic/hand/raka-matthanden.jpg"  ],
            ["pic/h-nyphanden.svg",        "Handform – Nyphanden",        "pic/hand/nyphanden.jpg"        ],
            ["pic/h-t-handen.svg",         "Handform – T-handen",         "pic/hand/t-handen.jpg"         ],
            ["pic/h-krokfingret.svg",      "Handform – Krokfingret",      "pic/hand/krokfingret.jpg"      ],
            ["pic/h-matthanden.svg",       "Handform – Måtthanden",       "pic/hand/matthanden.jpg"       ],
            ["pic/h-hallhanden.svg",       "Handform – Hållhanden",       "pic/hand/hallhanden.jpg"       ],
            ["pic/h-langfingret.svg",      "Handform – Långfingret",      "pic/hand/langfingret.jpg"      ],
            ["pic/h-n-handen.svg",         "Handform – N-handen",         "pic/hand/n-handen.jpg"         ],
            ["pic/h-lilla-o-handen.svg",   "Handform – Lilla O-handen",   "pic/hand/lilla-o-handen.jpg"   ],
            ["pic/h-v-handen.svg",         "Handform – V-handen",         "pic/hand/v-handen.jpg"         ],
            ["pic/h-tupphanden.svg",       "Handform – Tupphanden",       "pic/hand/tupphanden.jpg"       ],
            ["pic/h-k-handen.svg",         "Handform – K-handen",         "pic/hand/k-handen.jpg"         ],
            ["pic/h-dubbelkroken.svg",     "Handform – Dubbelkroken",     "pic/hand/dubbelkroken.jpg"     ],
            ["pic/h-bojda-tupphanden.svg", "Handform – Böjda tupphanden", "pic/hand/bojda-tupphanden.jpg" ],
            ["pic/h-m-handen.svg",         "Handform – M-handen",         "pic/hand/m-handen.jpg"         ],
            ["pic/h-w-handen.svg",         "Handform – W-handen",         "pic/hand/w-handen.jpg"         ],
            ["pic/h-lillfingret.svg",      "Handform – Lillfingret",      "pic/hand/lillfingret.jpg"      ],
            ["pic/h-flyghanden.svg",       "Handform – Flyghanden",       "pic/hand/flyghanden.jpg"       ],
            ["pic/h-stora-langfingret.svg","Handform – Stora långfingret","pic/hand/stora-langfingret.jpg"],
            ["pic/h-runda-langfingret.svg","Handform – Runda långfingret","pic/hand/runda-langfingret.jpg"],
            ["pic/h-stora-nyphanden.svg",  "Handform – Stora nyphanden",  "pic/hand/stora-nyphanden.jpg"  ],
            ["pic/h-x-handen.svg",         "Handform – X-handen",         "pic/hand/x-handen.jpg"         ],
        ],
        ar: [ // Attitydsriktning
            ["pic/ar-fram.svg",    "Attitydsriktning – Fram"   ],
            ["pic/ar-hoger.svg",   "Attitydsriktning – Höger"  ],
            ["pic/ar-in.svg",      "Attitydsriktning – In"     ],
            ["pic/ar-vanster.svg", "Attitydsriktning – Vänster"],
            ["pic/ar-upp.svg",     "Attitydsriktning – Upp"    ],
            ["pic/ar-ner.svg",     "Attitydsriktning – Ner"    ],
        ],
        av: [ // Attitydsvridning
            ["pic/av-fram.svg",    "Attitydsvridning – Fram"   ],
            ["pic/av-hoger.svg",   "Attitydsvridning – Höger"  ],
            ["pic/av-in.svg",      "Attitydsvridning – In"     ],
            ["pic/av-vanster.svg", "Attitydsvridning – Vänster"],
            ["pic/av-upp.svg",     "Attitydsvridning – Upp"    ],
            ["pic/av-ner.svg",     "Attitydsvridning – Ner"    ],
        ],
        i: [ // Interaktionsart
            ["pic/i-kors.svg",    "Interaktionsart – Kors"   ],
            ["pic/i-vinkel.svg",  "Interaktionsart – Vinkel" ],
            ["pic/i-hakning.svg", "Interaktionsart – Hakning"],
        ],
        artion_tall: [ // Artikulation
            ["pic/rr-fram.svg",         "Rörelseriktning – Fram"          ],
            ["pic/rr-hoger.svg",        "Rörelseriktning – Höger"         ],
            ["pic/rr-in.svg",           "Rörelseriktning – In"            ],
            ["pic/rr-vanster.svg",      "Rörelseriktning – Vänster"       ],
            ["pic/rr-fram-in.svg",      "Rörelseriktning – Fram–in"       ],
            ["pic/rr-vanster-hoger.svg","Rörelseriktning – Vänster–höger" ],
            ["pic/rr-upp.svg",          "Rörelseriktning – Upp"           ],
            ["pic/rr-ner.svg",          "Rörelseriktning – Ner"           ],
            ["pic/rr-kort-upp.svg",     "Rörelseriktning – Kort upp"      ],
            ["pic/rr-kort-ner.svg",     "Rörelseriktning – Kort ner"      ],
            ["pic/rr-upp-ner.svg",      "Rörelseriktning – Upp–ner"       ],
            ["pic/ra-spelar.svg",       "Rörelseart – Spelar"             ],
            ["pic/ra-forandras.svg",    "Rörelseart – Förändras"          ],
            ["pic/ra-stror.svg",        "Rörelseart – Strör"              ],
            ["pic/ra-vinkar.svg",       "Rörelseart – Vinkar"             ],
            ["pic/ra-bojs.svg",         "Rörelseart – Böjs"               ],
            ["pic/i-vaxelvis.svg",      "Interaktionsart – Växelvis"      ],
            ["pic/i-konvergerar.svg",   "Interaktionsart – Konvergerar"   ],
            ["pic/i-divergerar.svg",    "Interaktionsart – Divergerar"    ],
            ["pic/i-byte.svg",          "Interaktionsart – Byte"          ],
            ["pic/i-kors.svg",          "Interaktionsart – Kors"          ],
            ["pic/i-vinkel.svg",        "Interaktionsart – Vinkel"        ],
            ["pic/i-hakning.svg",       "Interaktionsart – Hakning"       ],
            ["pic/i-entre.svg",         "Interaktionsart – Entré"         ],
            ["pic/i-kontakt.svg",       "Interaktionsart – Kontakt"       ],
            ["pic/i-medial-kontakt.svg","Interaktionsart – Medial kontakt"],
            ["pic/x-upprepning.svg",    "Upprepad artikulation"           ],
            ["pic/x-separator.svg",     "Markerar sekventiell artikulation"],
        ],
        artion_high: [ // Artikulation
            ["pic/ra-bage.svg",   "Rörelseart – Båge"  ],
            ["pic/ra-cirkel.svg", "Rörelseart – Cirkel"],
            ["pic/ra-vrids.svg",  "Rörelseart – Vrids" ],
            ["pic/ra-slas.svg",   "Rörelseart – Slås"  ],
        ],
        artion_low: [ // Artikulation
            ["pic/rr-fram2.svg",          "Rörelseriktning – Fram"         ],
            ["pic/rr-hoger2.svg",         "Rörelseriktning – Höger"        ],
            ["pic/rr-in2.svg",            "Rörelseriktning – In"           ],
            ["pic/rr-vanster2.svg",       "Rörelseriktning – Vänster"      ],
            ["pic/rr-fram-in2.svg",       "Rörelseriktning – Fram–in"      ],
            ["pic/rr-vanster-hoger2.svg", "Rörelseriktning – Vänster–höger"],
            ["pic/rr-fixme.svg",          "Rörelseriktning – FIXME"        ],
            ["pic/rr-upp2.svg",           "Rörelseriktning – Upp"          ],
            ["pic/rr-ner2.svg",           "Rörelseriktning – Ner"          ],
            ["pic/rr-upp-ner2.svg",       "Rörelseriktning – Upp–ner"      ],
        ],
    },
    dom_stuff = {
        ia: {
            html: '<table class=ia>' +
                '<tr><td tabindex=1 class="r high">' +
                '<tr><td tabindex=1 class="a text">' +
                '</table>',
            glyphs: { r: glyphs.r, a: glyphs.a },
        },
        ib: {
            html: '<table class=ib>' +
                '<tr><td tabindex=1 class="r high">' +
                '<tr><td tabindex=1 class="h text" rowspan=2><td tabindex=1 class=ar>' +
                '<tr><td tabindex=1 class=av>' +
                '</table>',
            glyphs: {
                r:  glyphs.r,
                h:  glyphs.h,
                ar: glyphs.ar,
                av: glyphs.av,
            },
        },
        iia: {
            html: '<table class=iia>' +
                '<tr><td><td tabindex=1 class="r high">' +
                '<tr><td tabindex=1 class=ar><td tabindex=1 class="h text" rowspan=2>' +
                '<tr><td tabindex=1 class=av>' +
                '</table>',
            glyphs: {
                ar: glyphs.ar,
                av: glyphs.av,
                r:  glyphs.r,
                h:  glyphs.h,
                i:  glyphs.i,
            },
        },
        iib: {
            html: '<table class="iib">' +
                '<tr><td tabindex=1 class="i full">' +
                '</table>',
            glyphs: {
                i:  glyphs.i,
            },
        },
        iic: {
            html: '<table class=iic>' +
                '<tr><td colspan=2 class=high>' +
                '<tr><td tabindex=1 class="h text" rowspan=2><td tabindex=1 class=ar>' +
                '<tr><td tabindex=1 class=av>' +
                '</table>',
            glyphs: {
                h:  glyphs.h,
                ar: glyphs.ar,
                av: glyphs.av,
            },
        },
        iiia: {
            html: '<table class="FIXME iiia">' +
                '<tr><td tabindex=1 class="artion_tall full">' +
                '</table>',
            glyphs: { artion_tall: glyphs.artion_tall },
        },
        iiib: {
            html: '<table class=iiib>' +
                '<tr><td rowspan=2 class=full><td tabindex=1 class=artion_high>' +
                '<tr><td tabindex=1 class=artion_low>' +
                '</table>',
            glyphs: {
                artion_high: glyphs.artion_high,
                artion_low : glyphs.artion_low,
            },
        },
        iiic: {
            html: '<table class=iiic>' +
                '<tr><td rowspan=2 class=top><img src="pic/ra-forandras.svg"><td class=high>' +
                '<tr><td tabindex=1 class="h text">' +
                '</table>',
            glyphs: { h: glyphs.h },
        },
    },
    storage = (function () {
        function set(name, object) {
            localStorage.setItem(name, JSON.stringify(object));
        }
        function get(name) {
            return JSON.parse(localStorage.getItem(name));
        }
        return {
            getCurrentName: function () {
                return get('_selected') || '';
            },
            exist: function (name) {
                return (localStorage.getItem(name) === null) ? false : true;
            },
            set: function (name, object) {
                set('_selected', name);
                set(name, object);
            },
            get: function (name) {
                set('_selected', name);
                return get(name);
            },
            remove: function (name) {
                var loadList = this.list(),
                    selected = loadList.findIndex(function (name2) {
                        if (name2 === name) { return true; }
                    });
                localStorage.removeItem(name);
                loadList.splice(selected, 1);
                if (selected >= loadList.length) {
                    selected = loadList.length - 1;
                }
                set('_selected', loadList[selected]);
            },
            list: function () {
                var i, list = [];
                for (i = 0; i < localStorage.length; i += 1) {
                    var name = localStorage.key(i);
                    if (name[0] !== '_') { list.push(name); }
                }
                return list;
            }
        };
    }());

// Make sure all images are cached (so that script works even offline).
function preloadImages(glyphs) {
    var html = '';
    Object.keys(glyphs).forEach(function (name) {
        glyphs[name].forEach(function (glyph) {
            if (glyph[0]) { html += '<img src="' + glyph[0] + '">'; }
            if (glyph[2]) { html += '<img src="' + glyph[2] + '">'; }
        });
    });
    html = $(html).css('display', 'none');
    $('body').append(html);
}

function makeSign(spec) {
    var inElement = spec.element,   sign    = spec.sign,
        remove_cb = spec.remove_cb, prev_cb = spec.prev_cb,
        pics      =   dom_stuff[sign.type].glyphs,
        html      = $(dom_stuff[sign.type].html);

    Object.keys(dom_stuff[sign.type].glyphs).forEach(function (name) {
        // Set empty values in 'sign' to zero.
        sign[name] = sign[name] || 0;
    });
    var state = {}, element = {},
        html_controls = $("<caption class=controls><nobr>" +
                          "<span class=prev>◄</span>" +
                          "<span class=next>►</span>" +
                          "<span class=remove>✖</span>" +
                          "</nobr></caption>");
    function get(name) {
        return (name === undefined) ? state : state[name];
    }
    function set(name, value) {
        state[name] = value;
        redraw(name);
    }
    function redraw(name) {
        var loop = (name === undefined) ? Object.keys(state) : [name];
        loop.forEach(function (name) {
            var value = state[name];
            if (pics[name] && pics[name][value]) {
                var background = pics[name][value],
                    file = background[0],
                    desc = background[1] +
                        (background[2] ? '<br><img src="' + background[2] + '">' : '');
                statusElement.html(desc || "");
                if (file) {
                    element[name].html('<img src="' + file + '">');
                    if (file.match(/(medial-kontakt|x-separator)\.svg$/)) {
                        element[name].addClass('low');
                    } else {
                        element[name].removeClass('low');
                    }
                    return;
                }
            }
            element[name].html(value);
        });
    }
    function setNext(callback) {
        $(".next", html_controls).attr("disabled", false).click(callback);
    }

    Object.keys(sign).forEach(function (name) {
        element[name] = $("." + name, html);   // get DOM element
        set(name, sign[name]);                 //   set value & update DOM
        element[name].click(function () {
            selectGlyph(glyphs[name], 0, function (value) {
                set(name, value);
            });
        }).keydown(function () {
            var value = get(name);
            switch (event.key) {
            case "Enter":                      // change glyph
                selectGlyph(glyphs[name], 0, function (value) {
                    set(name, value);
                });
                break;
            default:
                console.log(event.key);
                return true;
            }
        });
    });

    /* previous / next / remove buttons */
    var prev = $(".prev", html_controls);
    if (prev_cb) {
        prev.click(prev_cb);
    } else {
        prev.attr("disabled", true);
    }
    $(".next", html_controls).attr("disabled", true);
    $(".remove", html_controls).click(remove_cb);

    html.append(html_controls);
    inElement[spec.prepend ? 'prepend' : 'append'](html);
    $("td[tabindex]", html).first().focus();
    return {
        get: get,
        set: set,
        setNext: setNext,
    }
}

////////////////////////////////////////////////////////////////////////////////

function makeSigns(element) {
    var signs = [];
    function get() {
        return signs.map(function (value) {
            return value.get();
        });
    }
    function set(values) {
        element.html("");
        signs = [];
        if (values) {
            values.forEach(add);
        }
    }
    function redraw() {
        set(get());
    }
    function remove(num) {
        signs.splice(num, 1);
        redraw();
    }
    function swap(x, y) {
        var tmp = signs[y];
        signs[y] = signs[x];
        signs[x] = tmp;
        redraw();
    }
    function add(sign) {
        var num = signs.length, prepend = sign.prepend;
        delete sign.prepend;
        signs[prepend ? 'unshift' : 'push'](makeSign({
            prepend:   prepend,
            element:   element,
            sign:     (sign || {}),
            remove_cb: (                 function () { remove(num);        }),
            prev_cb:   (num < 1 ? null : function () { swap(num, num - 1); }),
        }));
        if (prepend) {
            redraw();
        } else {
            if (num > 0) {                         // set '>' for previous sign
                signs[num - 1].setNext(function () { swap(num - 1, num); });
            }
        }
    }
    return {
        add: add,
        get: get,
        set: set,
    };
}

////////////////////////////////////////////////////////////////////////////////

function escapeHtml(text) {
    'use strict';
    return text.replace(/[\"&<>]/g, function (a) {
        return { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[a];
    });
}

function updateLoadList() {
    var selected = storage.getCurrentName(),
        names    = storage.list();
    loadInputElement.html(
        names.map(function (name) {
            return "<option" + (name === selected ? " selected" : "") +
                ">" + escapeHtml(name)
        }).join("")
    );
    if (names.length === 0) {
        loadInputElement.html('<option value="">Load name..');
        loadButtonElement.prop('disabled', true);
        deleteButtonElement.prop('disabled', true);
        loadInputElement.prop('disabled', true);
    } else {
        loadButtonElement.prop('disabled', false);
        deleteButtonElement.prop('disabled', false);
        loadInputElement.prop('disabled', false);
    }
}

function buttonLoad() {
    var name = loadInputElement.val();
    signs.set(storage.get(name));
    saveInputElement.val(name);
}
function buttonSave() {
    var name = saveInputElement.val();
    if (name === '') {
        alert("Cannot save transcription unless you give it a name!");
        saveInputElement.focus();
        return false;
    }
    if (name[0] === '_') {
        alert("Transcription name may not begin with an underscore!");
        saveInputElement.focus();
        return false;
    }
    if (storage.exist(name)) {
        if (!confirm("Overwrite existing transcript ‘" + name + "’?")) {
            return;
        }
    }
    storage.set(name, signs.get());
    updateLoadList();
    loadInputElement.val(name);
}
function buttonClear() {
    var name = "";
    signs.set([]);
    saveInputElement.val("");
}
function buttonDump() {
    var i, key, value, obj = {};
    for (i = 0; i < localStorage.length; i += 1) {
        var key = localStorage.key(i);
        var value = JSON.parse(localStorage.getItem(key));
        obj[key] = value;
    }
    console.log(JSON.stringify(obj, null, 4));
}
function buttonDelete() {
    var name = loadInputElement.val(), newName;
    if (confirm("Delete transcript ‘" + name + "’?")) {
        storage.remove(name);
        newName = storage.getCurrentName();
        signs.set(storage.get(newName));
        saveInputElement.val(newName);
        updateLoadList();
    }
}

function selectGlyph(menu, selectedValue, callback) {
    var tableElement    = $('table', overlayElement),
        selectedElement = $(document.activeElement),
        rowElements;

    function createMenu(menu) {
        tableElement.html(
            menu.map(function (value, key) {
                var glyph = value[0], text = value[1], image = value[2];
                return '<tr tabindex=1 data-value=' + key + '>' +
                    '<td><img src="' + glyph + '">' +
                    (image ? '<td><img src="' + image + '">' : '') +
                    '<td class=left>' + text;
            }).join('\n')
        );
        rowElements = $('tr', tableElement);
        $(overlayElement).keydown(handleMenuKeys).click(handleMenuClick);
        overlayElement.css('display', 'block')
        // FIXME: Focus the correct element, not first one.
        console.log(selectedValue);
        rowElements[0].focus();
    }

    function destroyMenu() {
        overlayElement.off().css('display', 'none');
        tableElement.empty();
        selectedElement.focus();               // reselect previously focused
    }

    function handleMenuClick(event) {
        var element = $(event.target),
            value   = element.closest('tr').data('value');
        destroyMenu();
        if (value !== undefined) { callback(value); }
        return false;
    }

    function handleMenuKeys(event) {
        var element = $(event.target),
            value   = element.data('value');
        switch (event.key) {
        case "Escape":
            destroyMenu();
            return false;
        case "ArrowUp":
            value -= 1;
            if (value < 0) { value = 0; }
            rowElements[value].focus();
            return false;
        case "ArrowDown":
            value += 1;
            if (value >= rowElements.length) { value = rowElements.length - 1; }
            rowElements[value].focus();
            return false;
        case "Enter":
            destroyMenu();
            callback(value);
            return false;
        default:
            console.log("Menu keypress: " + event.key);
        }
    }

    createMenu(menu);
}

////////////////////////////////////////////////////////////////////////////////

preloadImages(glyphs);
updateLoadList();
(function () {
    var selected = storage.getCurrentName();
    saveInputElement.val(selected);
}());

var signs = makeSigns(inputElement);
addIaButtonElement.  click(function() { signs.add({ type: 'ia', prepend: true }) });
addIbButtonElement.  click(function() { signs.add({ type: 'ib', prepend: true }) });
addIIaButtonElement. click(function() { signs.add({ type: 'iia'               }) });
addIIbButtonElement. click(function() { signs.add({ type: 'iib'               }) });
addIIcButtonElement. click(function() { signs.add({ type: 'iic'               }) });
addIIIaButtonElement.click(function() { signs.add({ type: 'iiia'              }) });
addIIIbButtonElement.click(function() { signs.add({ type: 'iiib'              }) });
addIIIcButtonElement.click(function() { signs.add({ type: 'iiic'              }) });
loadButtonElement.click(buttonLoad);
saveButtonElement.click(buttonSave);
clearButtonElement.click(buttonClear);
dumpButtonElement.click(buttonDump);
deleteButtonElement.click(buttonDelete);

buttonLoad();
$("div td[tabindex]").focus();

//[eof]
