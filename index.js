/* Copyright 2016 by zrajm. Released under GPLv3 license. */

var addIaButtonElement  = $("#ia")
    addIbButtonElement  = $("#ib")
    addIIaButtonElement = $("#iia")
    addIIbButtonElement = $("#iib")
    addIIcButtonElement = $("#iic")
    addIIIaButtonElement = $("#iiia")
    addIIIbButtonElement = $("#iiib")
    addIIIcButtonElement = $("#iiic")
    bodyElement         = $(document.body),
    windowElement       = $(window),
    loadButtonElement   = $("#load"),
    loadInputElement    = $("#load-input"),
    saveButtonElement   = $("#save"),
    saveInputElement    = $("#save-input"),
    dumpButtonElement   = $("#dump"),
    clearButtonElement  = $("#clear"),
    deleteButtonElement = $("#delete"),
    overlayElement      = $("#overlay"),
    statusElement       = $("#status"),
    transcript          = makeTranscript({
        i: $('#input td.i'), ii: $('#input td.ii'), iii: $('#input td.iii'),
    }),
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
            ["pic/ar-vanster.svg", "Attitydsriktning – Vänster"],
            ["pic/ar-hoger.svg",   "Attitydsriktning – Höger"  ],
            ["pic/ar-fram.svg",    "Attitydsriktning – Fram"   ],
            ["pic/ar-in.svg",      "Attitydsriktning – In"     ],
            ["pic/ar-upp.svg",     "Attitydsriktning – Upp"    ],
            ["pic/ar-ner.svg",     "Attitydsriktning – Ner"    ],
        ],
        av: [ // Attitydsvridning
            ["pic/av-vanster.svg", "Attitydsvridning – Vänster"],
            ["pic/av-hoger.svg",   "Attitydsvridning – Höger"  ],
            ["pic/av-fram.svg",    "Attitydsvridning – Fram"   ],
            ["pic/av-in.svg",      "Attitydsvridning – In"     ],
            ["pic/av-upp.svg",     "Attitydsvridning – Upp"    ],
            ["pic/av-ner.svg",     "Attitydsvridning – Ner"    ],
        ],
        ina: [ // Interaktionsart
            ["pic/i-kors.svg",    "Interaktionsart – Kors"   ],
            ["pic/i-vinkel.svg",  "Interaktionsart – Vinkel" ],
            ["pic/i-hakning.svg", "Interaktionsart – Hakning"],
        ],
        artion_tall: [ // Artikulation
            ["pic/rr-vanster.svg",      "Rörelseriktning – Vänster"       ],
            ["pic/rr-hoger.svg",        "Rörelseriktning – Höger"         ],
            ["pic/rr-vanster-hoger.svg","Rörelseriktning – Vänster–höger" ],
            ["pic/rr-fram.svg",         "Rörelseriktning – Fram"          ],
            ["pic/rr-in.svg",           "Rörelseriktning – In"            ],
            ["pic/rr-fram-in.svg",      "Rörelseriktning – Fram–in"       ],
            ["pic/rr-upp.svg",          "Rörelseriktning – Upp"           ],
            ["pic/rr-ner.svg",          "Rörelseriktning – Ner"           ],
            ["pic/rr-upp-ner.svg",      "Rörelseriktning – Upp–ner"       ],
            ["pic/rr-kort-upp.svg",     "Rörelseriktning – Kort upp"      ],
            ["pic/rr-kort-ner.svg",     "Rörelseriktning – Kort ner"      ],
            ["pic/ra-spelar.svg",       "Rörelseart – Spelar"             ],
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
            },
        },
        iib: {
            html: '<table class="iib">' +
                '<tr><td tabindex=1 class="ina full">' +
                '</table>',
            glyphs: {
                ina:  glyphs.ina,
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
            var json = localStorage.getItem(name);
            try {
                return JSON.parse(json);
            } catch (error) {
                if (error instanceof SyntaxError) {
                    console.warn("Syntax error in localStorage " +
                                 "JSON item '" + name + "'");
                    return null;
                }
                throw error;
            }
        }
        return {
            getCurrentName: function () {
                return get('_selected') || '';
            },
            exist: function (name) {
                return (get(name) == null) ? false : true;
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
function preloadImages(imageList) {
    var html = '';
    Object.keys(imageList).forEach(function (name) {
        imageList[name].forEach(function (image) {
            if (image[0]) { html += '<img src="' + image[0] + '">'; }
            if (image[2]) { html += '<img src="' + image[2] + '">'; }
        });
    });
    html = $(html).css('display', 'none');
    $('body').append(html);
}

function makeCluster(spec) {
    var inElement = spec.element,  cluster = spec.cluster,
        removeCb  = spec.removeCb, prevCb  = spec.prevCb,
        imageType = dom_stuff[cluster.type].glyphs,
        html      = $(dom_stuff[cluster.type].html),
        state = {}, element = {}, html_controls = undefined;

    // Make sure that no glyph value is undefined.
    Object.keys(imageType).forEach(function (name) {
        cluster[name] = cluster[name] || 0;
    });

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
            if (imageType[name] && imageType[name][value]) {
                var background = imageType[name][value],
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
        if (html_controls) {
            $(".next", html_controls).attr("disabled", false).click(callback);
        }
    }

    Object.keys(cluster).forEach(function (name) {
        element[name] = $("." + name, html);   // get DOM element
        set(name, cluster[name]);              //   set value & update DOM
        element[name].click(function () {
            selectGlyph(glyphs[name], get(name), function (value) {
                set(name, value);
            });
        }).keydown(function () {
            var value = get(name);
            switch (event.key) {
            case "Enter":                      // change glyph
                selectGlyph(glyphs[name], get(name), function (value) {
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
    if (cluster.type.match(/^iii[a-z]$/)) {
        html_controls = $("<caption class=controls><nobr>" +
                          "<span class=prev>◄</span>" +
                          "<span class=next>►</span>" +
                          "<span class=remove>✖</span>" +
                          "</nobr></caption>");
        var prev = $(".prev", html_controls);
        if (prevCb) {
            prev.click(prevCb);
        } else {
            prev.attr("disabled", true);
        }
        $(".next", html_controls).attr("disabled", true);
        $(".remove", html_controls).click(removeCb);
        html.append(html_controls);
    }
    inElement.append(html);
    $("td[tabindex]", html).first().focus();
    return {
        get: get,
        set: set,
        setNext: setNext,
    }
}

////////////////////////////////////////////////////////////////////////////////

function makeTranscript(element) {
    var clusters = [];
    function get() {
        return clusters.map(function (cluster) {
            return cluster.get();
        });
    }
    function set(values) {
        if (!(values instanceof Array)) {
            console.warn("makeTranscript.set(): Argument is not an array");
            values = [];
        }
        element.i.html('');
        element.ii.html('');
        element.iii.html('');
        clusters = values.map(function (cluster, num) {
            var type = cluster.type.replace(/[^i]+/, ''); // 'i', 'ii' or 'iii'
            return makeCluster({
                element:  element[type],
                cluster:  (cluster || {}),
                removeCb: (                 function () { remove(num);        }),
                prevCb:   (num < 1 ? null : function () { swap(num, num - 1); }),
            });
        });
    }
    function redraw() {
        set(get());
    }
    function remove(num) {
        clusters.splice(num, 1);
        redraw();
    }
    function swap(x, y) {
        var tmp = clusters[y];
        clusters[y] = clusters[x];
        clusters[x] = tmp;
        redraw();
    }

    // Remove all clusters of specified type.
    function removeCluster(clusters, clusterType) {
        var i = 0;
        while (i < clusters.length) {
            if (clusters[i].get('type') === clusterType) {
                clusters.splice(i, 1);
                continue;
            }
            i += 1;
        }
    }

    // Insert cluster into transcript. Clusters are sorted by type name, new
    // clusters is inserted in the appropriate place. If a cluster with the
    // same type name already exist, do nothing. Return true if cluster was
    // inserted, false otherwise.
    function insertCluster(clusters, cluster) {
        var i = 0, findType = cluster.get('type');
        while (i < clusters.length && clusters[i].get('type') < findType) {
            i += 1;
        }
        // Insert cluster before cluster of different type or last in list.
        if (clusters[i] === undefined || clusters[i].get('type') !== findType) {
            clusters.splice(i, 0, cluster);
            return true;
        }
        return false;
    }

    function add(cluster) {
        var num  = clusters.length, otherType,
            type = cluster.type.replace(/[^i]+/, ''); // 'i', 'ii' or 'iii'
            newCluster = makeCluster({
                element:  element[type],
                cluster:  (cluster || {}),
                removeCb: (                 function () { remove(num);        }),
                prevCb:   (num < 1 ? null : function () { swap(num, num - 1); }),
            });

        // Make sure there's *always* an IIc cluster in transcript.
        insertCluster(clusters, makeCluster({
            element:  element['ii'],
            cluster:  { type: 'iic'},
        }));
        switch (cluster.type) {
        case 'ia':
        case 'ib':
            otherType = cluster.type === 'ia' ? 'ib' : 'ia';
            insertCluster(clusters, newCluster) ||
                removeCluster(clusters, cluster.type);
            removeCluster(clusters, otherType);
            if (cluster.type === 'ib') {
                removeCluster(clusters, 'iia');
                removeCluster(clusters, 'iib');
            }
            break;
        case 'iia':
            removeCluster(clusters, 'ib');
            insertCluster(clusters, newCluster) ||
                removeCluster(clusters, cluster.type);
            removeCluster(clusters, 'iib');
            break;
        case 'iib':
            removeCluster(clusters, 'ib');
            insertCluster(clusters, makeCluster({
                element:  element[type],
                cluster:  { type: 'iia'},
            }));
            insertCluster(clusters, newCluster) ||
                removeCluster(clusters, cluster.type);
            break;
        case 'iic':
            removeCluster(clusters, 'iia');
            removeCluster(clusters, 'iib');
            break;
        case 'iiia':
        case 'iiib':
        case 'iiic':
            clusters.push(newCluster);
            if (num > 0) {                         // set '>' for prev cluster
                clusters[num - 1].setNext(function () { swap(num - 1, num); });
            }
            break;
        }
        redraw();
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
    transcript.set(storage.get(name));
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
    storage.set(name, transcript.get());
    updateLoadList();
    loadInputElement.val(name);
}
function buttonClear() {
    var name = "";
    transcript.set([{ "type": "iic" }]);
    saveInputElement.val("");
}
function buttonDump() {
    var obj = {};
    storage.list().forEach(function (name) {
        obj[name] = storage.get(name);
    });
    console.log(JSON.stringify(obj, null, 4));
}
function buttonDelete() {
    var name = loadInputElement.val(), newName;
    if (confirm("Delete transcript ‘" + name + "’?")) {
        storage.remove(name);
        newName = storage.getCurrentName();
        transcript.set(storage.get(newName));
        saveInputElement.val(newName);
        updateLoadList();
    }
}

function selectGlyph(menu, selectedValue, callback) {
    var tableElement    = $('table', overlayElement),
        selectedElement = $(document.activeElement),
        rowElements;

    function createMenu(menu) {
        bodyElement.addClass('overlay');
        windowElement.on('popstate', destroyMenu);
        history.pushState('', document.title + ": Select Glyph", "#select-glyph");
        tableElement.html(
            menu.map(function (value, key) {
                var glyph = value[0], text = value[1], image = value[2];
                return '<tr tabindex=1 data-value=' + key +
                    (selectedValue === key ? ' class=selected' : '') + '>' +
                    '<td><img src="' + glyph + '">' +
                    (image ? '<td><img src="' + image + '">' : '') +
                    '<td class=left>' + text;
            }).join('\n')
        );
        rowElements = $('tr', tableElement);
        $(overlayElement).keydown(handleMenuKeys).click(handleMenuClick);
        overlayElement.css('display', 'block')
        rowElements[selectedValue].focus();
    }

    function destroyMenu(backButtonEvent) {
        if (!backButtonEvent) { history.back(); }
        bodyElement.removeClass('overlay');
        windowElement.off('popstate');
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

addIaButtonElement.  click(function() { transcript.add({ type: 'ia'   }) });
addIbButtonElement.  click(function() { transcript.add({ type: 'ib'   }) });
addIIaButtonElement. click(function() { transcript.add({ type: 'iia'  }) });
addIIbButtonElement. click(function() { transcript.add({ type: 'iib'  }) });
addIIcButtonElement. click(function() { transcript.add({ type: 'iic'  }) });
addIIIaButtonElement.click(function() { transcript.add({ type: 'iiia' }) });
addIIIbButtonElement.click(function() { transcript.add({ type: 'iiib' }) });
addIIIcButtonElement.click(function() { transcript.add({ type: 'iiic' }) });
loadButtonElement.click(buttonLoad);
saveButtonElement.click(buttonSave);
clearButtonElement.click(buttonClear);
dumpButtonElement.click(buttonDump);
deleteButtonElement.click(buttonDelete);

buttonLoad();
$("div td[tabindex]").focus();

(function () {
    var input    = $('#input'),
        inputI   = $('td.i', input),
        inputII  = $('td.ii', input),
        inputIII = $('td.iii', input),
        buttonsI = $('table.i'),
        buttonsII = $('table.ii'),
        buttonsIII = $('table.iii');

    /* Hilite input fields when hovering on corresponding button groups. */
    buttonsI.hover(
        function () { input.add(inputI).   addClass('hover'); },
        function () { input.add(inputI).removeClass('hover'); }
    );
    buttonsII.hover(
        function () { input.add(inputII).   addClass('hover'); },
        function () { input.add(inputII).removeClass('hover'); }
    );
    buttonsIII.hover(
        function () { input.add(inputIII).   addClass('hover'); },
        function () { input.add(inputIII).removeClass('hover'); }
    );

    /* Hilite corresponding button groups when hovering on input fields. */
    inputI.hover(
        function () { buttonsI.   addClass('hover'); },
        function () { buttonsI.removeClass('hover'); }
    );
    inputII.hover(
        function () { buttonsII.   addClass('hover'); },
        function () { buttonsII.removeClass('hover'); }
    );
    inputIII.hover(
        function () { buttonsIII.   addClass('hover'); },
        function () { buttonsIII.removeClass('hover'); }
    );
}());

//[eof]
