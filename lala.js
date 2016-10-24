var addButtonElement  = $("button#add"),
    loadButtonElement = $("button#load"),
    saveButtonElement = $("button#save"),
    dumpButtonElement = $("button#dump"),
    inputElement = $("div");

function makeGlyphA(inElement, glyph, remove_cb, prev_cb) {
    var html = "<table border=1>" +
        "<tr><td class=a rowspan=2><td class=b>" +
        "<tr><td class=c>" +
        "</table>";
    // All fields must have value for makeGlyph() to work.
    [ "a", "b", "c"].forEach(function (name) {
        glyph[name] = glyph[name] || 0;
    });
    return makeGlyph(inElement, glyph, html, remove_cb, prev_cb);
}

function makeGlyph(inElement, glyph, html, remove_cb, prev_cb) {
    var state = {}, element = {}, html = $(html),
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
            element[name].html(state[name]);   // update DOM
        });
    }
    function setNext(callback) {
        $(".next", html_controls).attr("disabled", false).click(callback);
    }

    Object.keys(glyph).forEach(function (name) {
        element[name] = $("." + name, html);   // get DOM element
        set(name, glyph[name]);                //   set value & update DOM
        element[name].click(function() {       //   attach click function
            set(name, get(name) + 1);
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
        var glyph = glyph || {};
        var num   = glyphs.length;
        var remove_cb = function () { remove(num); };
        var prev_cb   = num < 1 ? null : function () { swap(num, num - 1); };
        glyphs.push(makeGlyphA(element, glyph, remove_cb, prev_cb));
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

addButtonElement.click(buttonAdd);
loadButtonElement.click(buttonLoad);
saveButtonElement.click(buttonSave);
dumpButtonElement.click(buttonDump);

buttonLoad();

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
