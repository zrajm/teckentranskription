var addButtonElement  = $("button#add"),
    addIaButtonElement = $("button#ia")
    addIbButtonElement = $("button#ib")
    addIIaButtonElement = $("button#iia")
    addIIbButtonElement = $("button#iib")
    addIIIButtonElement = $("button#iii")
    loadButtonElement = $("button#load"),
    saveButtonElement = $("button#save"),
    dumpButtonElement = $("button#dump"),
    inputElement      = $("div#input"),
    statusElement     = $("div#status");

var lists = {
    "Ia-r": [ // Relation
        ["pic/space_Truetrans2.svg", "I. Relation – Ingen"],
        ["pic/X_Truetrans1.svg",     "I. Relation – Över"],
        ["pic/y_Truetrans1.svg",     "I. Relation – Under"],
        ["pic/Y_Truetrans1.svg",     "I. Relation – Bredvid"],
        ["pic/z_Truetrans1.svg",     "I. Relation – Framför"],
        ["pic/Z_Truetrans1.svg",     "I. Relation – Bakom"],
    ],
    "Ia-a": [ // Artikulationsställe
        ["pic/space_Truetrans2.svg",        "I. Läge – Neutrala läget"],
        ["pic/exclam_Truetrans1.svg",       "I. Läge – Hjässan"],
        ["pic/parenright_Truetrans1.svg",   "I. Läge – Ansiktet, huvudhöjd"],
        ["pic/numbersign_Truetrans1.svg",   "I. Läge – Ansiktet, övre del"],
        ["pic/sterling_Truetrans1.svg",     "I. Läge – Ansiktet, nedre del"],
        ["pic/dollar_Truetrans1.svg",       "I. Läge – Pannan"],
        ["pic/percent_Truetrans1.svg",      "I. Läge – Ögonen"],
        ["pic/five_Truetrans2.svg",         "I. Läge – Ögat"],
        ["pic/bracketleft_Truetrans1.svg",  "I. Läge – Näsan"],
        ["pic/bracketright_Truetrans1.svg", "I. Läge – Sidorna av huvudet, öronen"],
        ["pic/asterisk_Truetrans1.svg",     "I. Läge – Sidan av huvudet, örat, höger"],
        ["pic/plus_Truetrans1.svg",         "I. Läge – Sidan av huvudet, örat, vänster"],
        ["pic/comma_Truetrans1.svg",        "I. Läge – Kinderna"],
        ["pic/hyphen_Truetrans1.svg",       "I. Läge – Kinden, höger"],
        ["pic/period_Truetrans1.svg",       "I. Läge – Kinden, vänster"],
        ["pic/slash_Truetrans1.svg",        "I. Läge – Munnen"],
        ["pic/colon_Truetrans1.svg",        "I. Läge – Hakan"],
        ["pic/semicolon_Truetrans1.svg",    "I. Läge – Nacken"],
        ["pic/less_Truetrans1.svg",         "I. Läge – Halsen"],
        ["pic/greater_Truetrans1.svg",      "I. Läge – Axlarna"],
        ["pic/question_Truetrans1.svg",     "I. Läge – Axeln, höger"],
        ["pic/underscore_Truetrans1.svg",   "I. Läge – Axeln, vänster"],
        ["pic/asciitilde_Truetrans1.svg",   "I. Läge – Armen"],
        ["pic/zero_Truetrans1.svg",         "I. Läge – Överarmen"],
        ["pic/one_Truetrans1.svg",          "I. Läge – Underarmen"],
        ["pic/two_Truetrans1.svg",          "I. Läge – Bröstet"],
        ["pic/three_Truetrans1.svg",        "I. Läge – Bröstet, höger sida"],
        ["pic/four_Truetrans1.svg",         "I. Läge – Bröstet, vänster sida"],
        ["pic/five_Truetrans1.svg",         "I. Läge – Magen, mellangärdet"],
        ["pic/six_Truetrans1.svg",          "I. Läge – Höfterna"],
        ["pic/seven_Truetrans1.svg",        "I. Läge – Höften, höger"],
        ["pic/eight_Truetrans1.svg",        "I. Läge – Höften, vänster"],
        ["pic/nine_Truetrans1.svg",         "I. Läge – Benet"],
    ],
};

function makeGlyphIa(spec) {
    spec.html = "<table class=ia>" +
        "<tr><td class=r tabindex=1>" +
        '<tr><td class=a tabindex=1>' +
        "</table>";
    // All fields must have value for makeGlyph() to work.
    [ "r", "a"].forEach(function (name) {
        spec.glyph[name] = spec.glyph[name] || 0;
    });
    //spec.glyph.type = "Ia";
    return makeGlyph(spec);
}

function makeGlyph(spec) {
    var inElement = spec.element,   glyph   = spec.glyph,
        remove_cb = spec.remove_cb, prev_cb = spec.prev_cb,
        html      = $(spec.html),   pics    = spec.pics;
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

    Object.keys(glyph).forEach(function (name) {
        element[name] = $("." + name, html);   // get DOM element
        set(name, glyph[name]);                //   set value & update DOM
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

function makeGlyphs(element) {
    var glyphs = [];
    function get() {
        return glyphs.map(function (value) {
            return value.get();
        });
    }
    function set(values) {
        element.html("");
        glyphs = [];
        values.forEach(add);
    }
    function redraw() {
        set(get());
    }
    function remove(num) {
        glyphs.splice(num, 1);
        redraw();
    }
    function swap(x, y) {
        var tmp = glyphs[y];
        glyphs[y] = glyphs[x];
        glyphs[x] = tmp;
        redraw();
    }
    function add(glyph) {
        var num = glyphs.length;
        glyphs.push(makeGlyphIa({
            element:   element,
            glyph:     (glyph || {}),
            remove_cb: (                 function () { remove(num);        }),
            prev_cb:   (num < 1 ? null : function () { swap(num, num - 1); }),
            pics: {
                r: lists["Ia-r"],
                a: lists["Ia-a"],
            },
        }));
        if (num > 0) {                         // set '>' for previous glyph
            glyphs[num - 1].setNext(function () { swap(num - 1, num); });
        }
    }
    return {
        add: add,
        get: get,
        set: set,
    };
}

////////////////////////////////////////////////////////////////////////////////

var glyphs = makeGlyphs(inputElement);

addIaButtonElement.click(buttonAdd);
loadButtonElement.click(buttonLoad);
saveButtonElement.click(buttonSave);
dumpButtonElement.click(buttonDump);

buttonLoad();
$("div table tr:first-child td:first-child").focus();

function buttonAdd() {
    glyphs.add();
}
function buttonLoad() {
    glyphs.set(JSON.parse(localStorage.getItem('glyphs')));
}
function buttonSave() {
    localStorage.setItem('glyphs', JSON.stringify(glyphs.get()));
}
function buttonDump() {
    console.log(JSON.stringify(glyphs.get(), null, 2));
}

//[eof]
