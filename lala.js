var addIaButtonElement  = $("#ia")
    addIbButtonElement  = $("#ib")
    addIIaButtonElement = $("#iia")
    addIIbButtonElement = $("#iib")
    addIIIaButtonElement = $("#iiia")
    addIIIbButtonElement = $("#iiib")
    addIIIcButtonElement = $("#iiic")
    addIIIdButtonElement = $("#iiid")
    loadButtonElement   = $("#load"),
    saveButtonElement   = $("#save"),
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
            //["pic/space_Truetrans2.svg", "Handform – 4-handen FIXME"],
            ["pic/C_Truetrans1.svg",     "Handform – A-handen"],
            ["pic/c_Truetrans1.svg",     "Handform – Tumvinkelhanden"],
            ["pic/F_Truetrans1.svg",     "Handform – Tumhanden"],
            ["pic/j_Truetrans1.svg",     "Handform – Måtthanden"],
            ["pic/h_Truetrans1.svg",     "Handform – Raka måtthanden"],
            ["pic/space_Truetrans2.svg", "Handform – D-handen FIXME"],
            ["pic/H_Truetrans1.svg",     "Handform – Nyphanden"],
            ["pic/l_Truetrans1.svg",     "Handform – Lilla O-handen"],
            ["pic/f_Truetrans1.svg",     "Handform – E-handen"],
            ["pic/space_Truetrans2.svg", "Handform – F-handenFIXME"],
            ["pic/E_Truetrans1.svg",     "Handform – Knutna handen"],
            ["pic/Q_Truetrans1.svg",     "Handform – Stora nyphanden"],
            ["pic/P_Truetrans1.svg",     "Handform – Lillfingret"],
            ["pic/p_Truetrans1.svg",     "Handform – Flyghanden"],
            ["pic/A_Truetrans1.svg",     "Handform – Flata handen"],
            ["pic/a_Truetrans1.svg",     "Handform – Flata tumhanden"],
            ["pic/I_Truetrans1.svg",     "Handform – Krokfingret"],
            ["pic/m_Truetrans1.svg",     "Handform – K-handen"],
            ["pic/g_Truetrans1.svg",     "Handform – Pekfingret"],
            ["pic/G_Truetrans1.svg",     "Handform – L-handen"],
            ["pic/o_Truetrans1.svg",     "Handform – M-handen"],
            ["pic/k_Truetrans1.svg",     "Handform – N-handen"],
            ["pic/e_Truetrans1.svg",     "Handform – O-handen"],
            ["pic/space_Truetrans2.svg", "Handform – Q-handen FIXME"],
            ["pic/r_Truetrans2.svg",     "Handform – Långfingret"],
            ["pic/d_Truetrans1.svg",     "Handform – S-handen"],
            ["pic/D_Truetrans1.svg",     "Handform – Klohanden"],
            ["pic/i_Truetrans1.svg",     "Handform – T-handen"],
            ["pic/J_Truetrans1.svg",     "Handform – Hållhanden"],
            ["pic/U_Truetrans2.svg",     "Handform – Dubbelkroken"],
            ["pic/N_Truetrans1.svg",     "Handform – Böjda tupphanden"],
            ["pic/L_Truetrans1.svg",     "Handform – V-handen"],
            ["pic/M_Truetrans1.svg",     "Handform – Tupphanden"],
            ["pic/B_Truetrans1.svg",     "Handform – Vinkelhanden"],
            ["pic/w_Truetrans2.svg",     "Handform – W-handen"],
            ["pic/R_Truetrans1.svg",     "Handform – X-handen"],
            // ["pic/Z_Truetrans2.svg",     "Handform – X-handen"],
            ["pic/b_Truetrans1.svg",     "Handform – Sprethanden"],
            ["pic/q_Truetrans1.svg",     "Handform – Stora långfingret"],
            ["pic/aring_Truetrans1.svg", "Handform – Runda långfingret"],
        ],
        ar: [
            ["pic/r_Truetrans1.svg", "Attitydsriktning – Vänster"],
            ["pic/s_Truetrans1.svg", "Attitydsriktning – Höger"],
            ["pic/S_Truetrans1.svg", "Attitydsriktning – Fram"],
            ["pic/t_Truetrans1.svg", "Attitydsriktning – In"],
            ["pic/T_Truetrans1.svg", "Attitydsriktning – Upp"],
            ["pic/u_Truetrans1.svg", "Attitydsriktning – Ner"],
        ],
        av: [
            ["pic/U_Truetrans1.svg", "Attitydsvridning – Vänster"],
            ["pic/v_Truetrans1.svg", "Attitydsvridning – Höger"],
            ["pic/V_Truetrans1.svg", "Attitydsvridning – Fram"],
            ["pic/w_Truetrans1.svg", "Attitydsvridning – In"],
            ["pic/W_Truetrans1.svg", "Attitydsvridning – Upp"],
            ["pic/x_Truetrans1.svg", "Attitydsvridning – Ner"],
        ],
        i: [
            ["pic/asciitilde_Truetrans2.svg", "Interaktionsart – Kors"],
            ["pic/three_Truetrans2.svg",      "Interaktionsart – Vinkel"],
            ["pic/zero_Truetrans2.svg",       "Interaktionsart – Hakning"],
        ],
        artion_tall: [
            ["pic/dollar_Truetrans2.svg",       "Rörelseriktning – Vänster"],
            ["pic/percent_Truetrans2.svg",      "Rörelseriktning – Höger"],
            ["pic/ampersand_Truetrans2.svg",    "Rörelseriktning – Vänster–höger"],
            ["pic/bracketleft_Truetrans2.svg",  "Rörelseriktning – Fram"],
            ["pic/bracketright_Truetrans2.svg", "Rörelseriktning – In"],
            ["pic/asterisk_Truetrans2.svg",     "Rörelseriktning – Fram–in"],
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
            ["pic/c_Truetrans2.svg", "Rörelseriktning – Vänster"],
            ["pic/D_Truetrans2.svg", "Rörelseriktning – Höger"],
            ["pic/d_Truetrans2.svg", "Rörelseriktning – Vänster–höger"],
            ["pic/E_Truetrans2.svg", "Rörelseriktning – Fram"],
            ["pic/e_Truetrans2.svg", "Rörelseriktning – In"],
            ["pic/f_Truetrans2.svg", "Rörelseriktning – Fram–in"],
            ["pic/F_Truetrans2.svg", "Rörelseriktning – Upp"],
            ["pic/G_Truetrans2.svg", "Rörelseriktning – Ner"],
            ["pic/g_Truetrans2.svg", "Rörelseriktning – Upp–ner"],
            ["pic/H_Truetrans2.svg", "Rörelseriktning – FIXME"],
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
                '<tr><td><td tabindex=1 class=r><td>' +
                '<tr><td tabindex=1 class=ar><td tabindex=1 class=h rowspan=2><td tabindex=1 class=i>' +
                '<tr><td tabindex=1 class=av><td>  ' +
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
                    desc = background[1];
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
        set(name, sign[name]);                //   set value & update DOM
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
        values.forEach(add);
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

var signs = makeSigns(inputElement);
addIaButtonElement.click( function() { signs.add({ type: 'ia'  }) });
addIbButtonElement.click( function() { signs.add({ type: 'ib'  }) });
addIIaButtonElement.click(function() { signs.add({ type: 'iia' }) });
addIIbButtonElement.click(function() { signs.add({ type: 'iib' }) });
addIIIaButtonElement.click(function() { signs.add({ type: 'iiia' }) });
addIIIbButtonElement.click(function() { signs.add({ type: 'iiib' }) });
addIIIcButtonElement.click(function() { signs.add({ type: 'iiic' }) });
addIIIdButtonElement.click(function() { signs.add({ type: 'iiid' }) });
loadButtonElement.click(buttonLoad);
saveButtonElement.click(buttonSave);
dumpButtonElement.click(buttonDump);

buttonLoad();
$("div table tr:first-child td:first-child").focus();

function buttonLoad() {
    signs.set(JSON.parse(localStorage.getItem('signs')));
}
function buttonSave() {
    localStorage.setItem('signs', JSON.stringify(signs.get()));
}
function buttonDump() {
    console.log(JSON.stringify(signs.get(), null, 2));
}

//[eof]
