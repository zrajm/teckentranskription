var addIaButtonElement  = $("#ia")
    addIbButtonElement  = $("#ib")
    addIIaButtonElement = $("#iia")
    addIIbButtonElement = $("#iib")
    addIIcButtonElement = $("#iic")
    addIIIaButtonElement = $("#iiia")
    addIIIbButtonElement = $("#iiib")
    addIIIcButtonElement = $("#iiic")
    addIIIdButtonElement = $("#iiid")
    loadButtonElement   = $("#load"),
    loadInputElement    = $("#load-input"),
    saveButtonElement   = $("#save"),
    saveInputElement    = $("#save-input"),
    dumpButtonElement   = $("#dump"),
    inputElement        = $("#input"),
    statusElement       = $("#status"),
    glyphs = {
        r: [ // Relation
            ["pic/space_Truetrans2.svg", "Relation – Ingen"],
            ["pic/X_Truetrans1.svg",     "Relation – Över"],
            ["pic/y_Truetrans1.svg",     "Relation – Under"],
            ["pic/Y_Truetrans1.svg",     "Relation – Bredvid"],
            ["pic/z_Truetrans1.svg",     "Relation – Framför"],
            ["pic/Z_Truetrans1.svg",     "Relation – Bakom"],
        ],
        a: [ // Artikulationsställe
            //["pic/space_Truetrans2.svg",        "Läge – Neutrala läget"],
            ["pic/exclam_Truetrans1.svg",       "Läge – Hjässan"],
            ["pic/parenright_Truetrans1.svg",   "Läge – Ansiktet, huvudhöjd"],
            ["pic/numbersign_Truetrans1.svg",   "Läge – Ansiktet, övre del"],
            ["pic/sterling_Truetrans1.svg",     "Läge – Ansiktet, nedre del"],
            ["pic/dollar_Truetrans1.svg",       "Läge – Pannan"],
            ["pic/percent_Truetrans1.svg",      "Läge – Ögonen"],
            ["pic/five_Truetrans2.svg",         "Läge – Ögat"],
            ["pic/bracketleft_Truetrans1.svg",  "Läge – Näsan"],
            ["pic/bracketright_Truetrans1.svg", "Läge – Sidorna av huvudet, öronen"],
            ["pic/asterisk_Truetrans1.svg",     "Läge – Sidan av huvudet, örat, höger"],
            ["pic/plus_Truetrans1.svg",         "Läge – Sidan av huvudet, örat, vänster"],
            ["pic/comma_Truetrans1.svg",        "Läge – Kinderna"],
            ["pic/hyphen_Truetrans1.svg",       "Läge – Kinden, höger"],
            ["pic/period_Truetrans1.svg",       "Läge – Kinden, vänster"],
            ["pic/slash_Truetrans1.svg",        "Läge – Munnen"],
            ["pic/colon_Truetrans1.svg",        "Läge – Hakan"],
            ["pic/semicolon_Truetrans1.svg",    "Läge – Nacken"],
            ["pic/less_Truetrans1.svg",         "Läge – Halsen"],
            ["pic/greater_Truetrans1.svg",      "Läge – Axlarna"],
            ["pic/question_Truetrans1.svg",     "Läge – Axeln, höger"],
            ["pic/underscore_Truetrans1.svg",   "Läge – Axeln, vänster"],
            ["pic/asciitilde_Truetrans1.svg",   "Läge – Armen"],
            ["pic/zero_Truetrans1.svg",         "Läge – Överarmen"],
            ["pic/one_Truetrans1.svg",          "Läge – Underarmen"],
            ["pic/two_Truetrans1.svg",          "Läge – Bröstet"],
            ["pic/three_Truetrans1.svg",        "Läge – Bröstet, höger sida"],
            ["pic/four_Truetrans1.svg",         "Läge – Bröstet, vänster sida"],
            ["pic/five_Truetrans1.svg",         "Läge – Magen, mellangärdet"],
            ["pic/six_Truetrans1.svg",          "Läge – Höfterna"],
            ["pic/seven_Truetrans1.svg",        "Läge – Höften, höger"],
            ["pic/eight_Truetrans1.svg",        "Läge – Höften, vänster"],
            ["pic/nine_Truetrans1.svg",         "Läge – Benet"],
        ],
        h: [
            ["pic/flata-handen.svg",     "Handform – Flata handen",     "pic/hand/flata-handen.jpg"     ],
            ["pic/flata-tumhanden.svg",  "Handform – Flata tumhanden",  "pic/hand/flata-tumhanden.jpg"  ],
            ["pic/sprethanden.svg",      "Handform – Sprethanden",      "pic/hand/sprethanden.jpg"      ],
            ["pic/4-handen.svg",         "Handform – 4-handen",         "pic/hand/4-handen.jpg"         ],
            ["pic/d-handen.svg",         "Handform – D-handen",         "pic/hand/d-handen.jpg"         ],
            ["pic/f-handen.svg",         "Handform – F-handen",         "pic/hand/f-handen.jpg"         ],
            ["pic/vinkelhanden.svg",     "Handform – Vinkelhanden",     "pic/hand/vinkelhanden.jpg"     ],
            ["pic/tumvinkelhanden.svg",  "Handform – Tumvinkelhanden",  "pic/hand/tumvinkelhanden.jpg"  ],
            ["pic/a-handen.svg",         "Handform – A-handen",         "pic/hand/a-handen.jpg"         ],
            ["pic/s-handen.svg",         "Handform – S-handen",         "pic/hand/s-handen.jpg"         ],
            ["pic/klohanden.svg",        "Handform – Klohanden",        "pic/hand/klohanden.jpg"        ],
            ["pic/o-handen.svg",         "Handform – O-handen",         "pic/hand/o-handen.jpg"         ],
            ["pic/knutna-handen.svg",    "Handform – Knutna handen",    "pic/hand/knutna-handen.jpg"    ],
            ["pic/e-handen.svg",         "Handform – E-handen",         "pic/hand/e-handen.jpg"         ],
            ["pic/tumhanden.svg",        "Handform – Tumhanden",        "pic/hand/tumhanden.jpg"        ],
            ["pic/q-handen.svg",         "Handform – Q-handen",         "pic/hand/q-handen.jpg"         ],
            ["pic/pekfingret.svg",       "Handform – Pekfingret",       "pic/hand/pekfingret.jpg"       ],
            ["pic/l-handen.svg",         "Handform – L-handen",         "pic/hand/l-handen.jpg"         ],
            ["pic/raka-matthanden.svg",  "Handform – Raka måtthanden",  "pic/hand/raka-matthanden.jpg"  ],
            ["pic/nyphanden.svg",        "Handform – Nyphanden",        "pic/hand/nyphanden.jpg"        ],
            ["pic/t-handen.svg",         "Handform – T-handen",         "pic/hand/t-handen.jpg"         ],
            ["pic/krokfingret.svg",      "Handform – Krokfingret",      "pic/hand/krokfingret.jpg"      ],
            ["pic/matthanden.svg",       "Handform – Måtthanden",       "pic/hand/matthanden.jpg"       ],
            ["pic/hallhanden.svg",       "Handform – Hållhanden",       "pic/hand/hallhanden.jpg"       ],
            ["pic/langfingret.svg",      "Handform – Långfingret",      "pic/hand/langfingret.jpg"      ],
            ["pic/n-handen.svg",         "Handform – N-handen",         "pic/hand/n-handen.jpg"         ],
            ["pic/lilla-o-handen.svg",   "Handform – Lilla O-handen",   "pic/hand/lilla-o-handen.jpg"   ],
            ["pic/v-handen.svg",         "Handform – V-handen",         "pic/hand/v-handen.jpg"         ],
            ["pic/tupphanden.svg",       "Handform – Tupphanden",       "pic/hand/tupphanden.jpg"       ],
            ["pic/k-handen.svg",         "Handform – K-handen",         "pic/hand/k-handen.jpg"         ],
            ["pic/dubbelkroken.svg",     "Handform – Dubbelkroken",     "pic/hand/dubbelkroken.jpg"     ],
            ["pic/bojda-tupphanden.svg", "Handform – Böjda tupphanden", "pic/hand/bojda-tupphanden.jpg" ],
            ["pic/m-handen.svg",         "Handform – M-handen",         "pic/hand/m-handen.jpg"         ],
            ["pic/w-handen.svg",         "Handform – W-handen",         "pic/hand/w-handen.jpg"         ],
            ["pic/lillfingret.svg",      "Handform – Lillfingret",      "pic/hand/lillfingret.jpg"      ],
            ["pic/flyghanden.svg",       "Handform – Flyghanden",       "pic/hand/flyghanden.jpg"       ],
            ["pic/stora-langfingret.svg","Handform – Stora långfingret","pic/hand/stora-langfingret.jpg"],
            ["pic/runda-langfingret.svg","Handform – Runda långfingret","pic/hand/runda-langfingret.jpg"],
            ["pic/stora-nyphanden.svg",  "Handform – Stora nyphanden",  "pic/hand/stora-nyphanden.jpg"  ],
            ["pic/x-handen.svg",         "Handform – X-handen",         "pic/hand/x-handen.jpg"         ],
        ],
        ar: [
            ["pic/S_Truetrans1.svg", "Attitydsriktning – Fram"],
            ["pic/s_Truetrans1.svg", "Attitydsriktning – Höger"],
            ["pic/t_Truetrans1.svg", "Attitydsriktning – In"],
            ["pic/r_Truetrans1.svg", "Attitydsriktning – Vänster"],
            ["pic/T_Truetrans1.svg", "Attitydsriktning – Upp"],
            ["pic/u_Truetrans1.svg", "Attitydsriktning – Ner"],
        ],
        av: [
            ["pic/V_Truetrans1.svg", "Attitydsvridning – Fram"],
            ["pic/v_Truetrans1.svg", "Attitydsvridning – Höger"],
            ["pic/w_Truetrans1.svg", "Attitydsvridning – In"],
            ["pic/U_Truetrans1.svg", "Attitydsvridning – Vänster"],
            ["pic/W_Truetrans1.svg", "Attitydsvridning – Upp"],
            ["pic/x_Truetrans1.svg", "Attitydsvridning – Ner"],
        ],
        i: [
            ["pic/asciitilde_Truetrans2.svg", "Interaktionsart – Kors"],
            ["pic/three_Truetrans2.svg",      "Interaktionsart – Vinkel"],
            ["pic/zero_Truetrans2.svg",       "Interaktionsart – Hakning"],
        ],
        artion_tall: [
            ["pic/bracketleft_Truetrans2.svg",  "Rörelseriktning – Fram"],
            ["pic/percent_Truetrans2.svg",      "Rörelseriktning – Höger"],
            ["pic/bracketright_Truetrans2.svg", "Rörelseriktning – In"],
            ["pic/dollar_Truetrans2.svg",       "Rörelseriktning – Vänster"],
            ["pic/asterisk_Truetrans2.svg",     "Rörelseriktning – Fram–in"],
            ["pic/ampersand_Truetrans2.svg",    "Rörelseriktning – Vänster–höger"],
            ["pic/plus_Truetrans2.svg",         "Rörelseriktning – Upp"],
            ["pic/comma_Truetrans2.svg",        "Rörelseriktning – Ner"],
            ["pic/hyphen_Truetrans2.svg",       "Rörelseriktning – Upp–ner"],
            ["pic/eight_Truetrans2.svg",        "Rörelseart – Spelar"],
            ["pic/a_Truetrans2.svg",            "Rörelseart – Förändras"],
            ["pic/nine_Truetrans2.svg",         "Rörelseart – Strör"],
            ["pic/A_Truetrans2.svg",            "Rörelseart – Vinklar"],
            ["pic/egen-bojs.svg",               "Rörelseart – Böjs"],
            ["pic/b_Truetrans2.svg",            "Interaktionsart – Växelvis"],
            ["pic/underscore_Truetrans2.svg",   "Interaktionsart – Konvergerar"],
            ["pic/question_Truetrans2.svg",     "Interaktionsart – Divergerar"],
            ["pic/one_Truetrans2.svg",          "Interaktionsart – Byte"],
            ["pic/asciitilde_Truetrans2.svg",   "Interaktionsart – Kors"],
            ["pic/three_Truetrans2.svg",        "Interaktionsart – Vinkel"],
            ["pic/zero_Truetrans2.svg",         "Interaktionsart – Hakning"],
            ["pic/two_Truetrans2.svg",          "Interaktionsart – Entré"],
            ["pic/equal_Truetrans1.svg",        "Interaktionsart – Kontakt"],
            ["pic/numbersign_Truetrans2.svg",   "Interaktionsart – Medial kontakt"],
        ],
        artion_high: [
            ["pic/four_Truetrans2.svg",  "Rörelseart – Båge"],
            ["pic/five_Truetrans2.svg",  "Rörelseart – Cirkel"],
            ["pic/seven_Truetrans2.svg", "Rörelseart – Vrids"],
            ["pic/six_Truetrans2.svg",   "Rörelseart – Slås"],
        ],
        artion_low: [
            ["pic/E_Truetrans2.svg", "Rörelseriktning – Fram"],
            ["pic/D_Truetrans2.svg", "Rörelseriktning – Höger"],
            ["pic/e_Truetrans2.svg", "Rörelseriktning – In"],
            ["pic/c_Truetrans2.svg", "Rörelseriktning – Vänster"],
            ["pic/f_Truetrans2.svg", "Rörelseriktning – Fram–in"],
            ["pic/d_Truetrans2.svg", "Rörelseriktning – Vänster–höger"],
            ["pic/H_Truetrans2.svg", "Rörelseriktning – FIXME"],
            ["pic/F_Truetrans2.svg", "Rörelseriktning – Upp"],
            ["pic/G_Truetrans2.svg", "Rörelseriktning – Ner"],
            ["pic/g_Truetrans2.svg", "Rörelseriktning – Upp–ner"],
        ],
        artion_sep: [
            ["pic/B_Truetrans2.svg", "Upprepad artikulation"],
            ["pic/C_Truetrans2.svg", "Markerar sekventiell artikulation"],
        ],
    },
    dom_stuff = {
        ia: {
            html: '<table class=ia>' +
                '<tr><td tabindex=1 class=r>' +
                '<tr><td tabindex=1 class=a>' +
                '</table>',
            glyphs: { r: glyphs.r, a: glyphs.a },
        },
        ib: {
            html: '<table class=ib>' +
                '<tr><td tabindex=1 class=r>' +
                '<tr><td tabindex=1 class=h rowspan=2><td tabindex=1 class=ar>' +
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
                '<tr><td><td tabindex=1 class=r>' +
                '<tr><td tabindex=1 class=ar><td tabindex=1 class=h rowspan=2>' +
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
            html: '<table class=iib>' +
                '<tr><td style=width:0><td class=r>' +
                '<tr><td style=width:0 class=h rowspan=2><td tabindex=1 class=i>' +
                '<tr><td>  ' +
                '</table>',
            glyphs: {
                i:  glyphs.i,
            },
        },
        iic: {
            html: '<table class=iib>' +
                '<tr><td colspan=2>' +
                '<tr><td tabindex=1 class=h rowspan=2><td tabindex=1 class=ar>' +
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
                '<tr><td colspan=2>' +
                '<tr><td tabindex=1 class=artion_tall>' +
                '</table>',
            glyphs: { artion_tall: glyphs.artion_tall },
        },
        iiib: {
            html: '<table class=iiib>' +
                '<tr><td colspan=2>' +
                '<tr><td tabindex=1 class=artion_high>' +
                '<tr><td tabindex=1 class=artion_low>' +
                '</table>',
            glyphs: {
                artion_high: glyphs.artion_high,
                artion_low : glyphs.artion_low,
            },
        },
        iiic: {
            html: '<table class=iiic>' +
                '<tr><td colspan=2>' +
                '<tr><td tabindex=1 class=artion_sep>' +
                '</table>',
            glyphs: { artion_sep: glyphs.artion_sep },
        },
        iiid: {
            html: '<table class=iiid>' +
                '<tr><td colspan=2>' +
                '<tr><td tabindex=1 class=h>' +
                '</table>',
            glyphs: { h: glyphs.h },
        },
    },
    storage = {
        set: function (name, object) {
            return localStorage.setItem(name, JSON.stringify(object));
        },
        get: function (name) {
            return JSON.parse(localStorage.getItem(name));
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
                    element[name].css("background-image", "url('" + file + "')");
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
        element[name].keydown(function() {     //   attach click function
            var value = get(name), max = pics[name].length;
            switch (event.key) {
            case "ArrowLeft":
                value -= 1;
                while (value < 0) { value += max; }
                break;
            case "ArrowRight":
                value = (value + 1) % max;
                break;
            default:
                console.log(event.key);
                return true;
            }
            set(name, value);
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
    inElement.append(html);
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
        var num = signs.length;
        signs.push(makeSign({
            element:   element,
            sign:     (sign || {}),
            remove_cb: (                 function () { remove(num);        }),
            prev_cb:   (num < 1 ? null : function () { swap(num, num - 1); }),
        }));
        if (num > 0) {                         // set '>' for previous sign
            signs[num - 1].setNext(function () { swap(num - 1, num); });
        }
    }
    return {
        add: add,
        get: get,
        set: set,
    };
}

////////////////////////////////////////////////////////////////////////////////

function updateLoadList() {
    var selected = storage.get('_selected');
    loadInputElement.html(
        storage.list().map(function (name) {
            return "<option" + (name === selected ? " selected" : "") +
                ">" + name
        }).join("")
    );
}

updateLoadList();
(function () {
    var selected = storage.get('_selected');
    saveInputElement.val(selected);
}());

var signs = makeSigns(inputElement);
addIaButtonElement.click( function() { signs.add({ type: 'ia'  }) });
addIbButtonElement.click( function() { signs.add({ type: 'ib'  }) });
addIIaButtonElement.click(function() { signs.add({ type: 'iia' }) });
addIIbButtonElement.click(function() { signs.add({ type: 'iib' }) });
addIIcButtonElement.click(function() { signs.add({ type: 'iic' }) });
addIIIaButtonElement.click(function() { signs.add({ type: 'iiia' }) });
addIIIbButtonElement.click(function() { signs.add({ type: 'iiib' }) });
addIIIcButtonElement.click(function() { signs.add({ type: 'iiic' }) });
addIIIdButtonElement.click(function() { signs.add({ type: 'iiid' }) });
loadButtonElement.click(buttonLoad);
saveButtonElement.click(buttonSave);
dumpButtonElement.click(buttonDump);

buttonLoad();
$("div td[tabindex]").focus();

function buttonLoad() {
    var name = loadInputElement.val();
    signs.set(storage.get(name));
    storage.set('_selected', name);
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
    storage.set(name, signs.get());
    storage.set('_selected', name);
    updateLoadList();
}
function buttonDump() {
    var superobj = {};
    storage.list().forEach(function (name) {
        superobj[name] = storage.get(name);
    });
    console.log(JSON.stringify(superobj, null, 4));
}

//[eof]
