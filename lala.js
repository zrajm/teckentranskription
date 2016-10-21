var addButtonElement  = $("button#add"),
    loadButtonElement = $("button#load"),
    saveButtonElement = $("button#save"),
    dumpButtonElement = $("button#dump"),
    inputElement = $("div"),
    glyphs = [];

addButtonElement.click(addGlyph);
loadButtonElement.click(loadGlyphs);
saveButtonElement.click(saveGlyphs);
dumpButtonElement.click(buttonDump);

function incElement() {
    var elem = $(this);
    var x = parseInt(elem.text(), 10);
    elem.text(x + 1);
}

function makeGlyphA(inElement, glyph) {
    var html = "<table border=1>" +
        "<tr><td class=a rowspan=2><td class=b>" +
        "<tr><td class=c>" +
        "</table>",
        classes = [ "a", "b", "c" ];
    return makeGlyph(inElement, glyph, html, classes);
}

function makeGlyph(inElement, glyph, html, classes) {
    var state = {}, element = {};
    html = $(html);
    function get(name) {
        return state[name];
    }
    function set(name, value) {
        state[name] = value;
        element[name].html(value);
        return value;
    }
    function dump() {
        return state;
    }
    classes.forEach(function (name) {
        element[name] = $("." + name, html);   // get DOM element
        set(name, glyph[name] || 0);           // set state
        element[name].click(function() {
            set(name, get(name) + 1);
        });
    });
    inElement.append(html);
    return {
        get: get,
        set: set,
        dump: dump,
    }
}


////////////////////////////////////////////////////////////////////////////////
//
// TODO
//   * Put global list into object of its own
//   * Delete glyph from global list
//   * Different type of glyphs

////////////////////////////////////////////////////////////////////////////////

function getGlyphs() {
    return glyphs.map(function (value) {
        return value.dump();
    });
}

function setGlyphs(values) {
    inputElement.html("");
    glyphs = values.map(function (glyph) {
        return makeGlyphA(inputElement, glyph);
    });
}

function loadGlyphs() {
    var loadedGlyphs = JSON.parse(localStorage.getItem('glyphs'));
    setGlyphs(loadedGlyphs);
}

function saveGlyphs() {
    localStorage.setItem('glyphs', JSON.stringify(getGlyphs()));
}

function addGlyph() {
    glyphs.push(makeGlyphA(inputElement, {}));
}

////////////////////////////////////////////////////////////////////////////////

loadGlyphs();

function buttonDump() {
    console.log(JSON.stringify(getGlyphs(), null, 2));
}

//[eof]
