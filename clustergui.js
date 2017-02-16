/* Copyright 2017 by zrajm. Released under GPLv3 license. */

// This is a singleton module (i.e. should only be invoked once).
function makeClusterGui(transcriptElement, glyphData) {
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
        dom_stuff = {
            ia  : { r: glyphs.r, a: glyphs.a },
            ib  : { r: glyphs.r, h: glyphs.h, ar: glyphs.ar, av: glyphs.av },
            iia : { ar: glyphs.ar, av: glyphs.av, r: glyphs.r, h: glyphs.h },
            iib : { ina: glyphs.ina },
            iic : { h: glyphs.h, ar: glyphs.ar, av: glyphs.av },
            iiia: { artion_tall: glyphs.artion_tall },
            iiib: { artion_high: glyphs.artion_high, artion_low: glyphs.artion_low },
            iiic: { h: glyphs.h },
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
        Object.keys(glyphData).forEach(function (glyphType) {
            var glyphList = glyphData[glyphType];
            glyphImages[glyphType] = {};
            glyphList.forEach(function (value, index) {
                var file = value[0], shortkey = value[2],
                    html = '<img src="' + file + '">';
                glyphImages[glyphType][index] = html;
            });
        });
        return glyphImages;
    }

    // Create DOM element for a new clusterType without displaying it in the
    // GUI. DOM elements for clusters in field I & II are reused, while
    // elements for clusters in field III are added.
    function initGlyph(clusterType) {
        var element, fieldType = fieldNameOf[clusterType];
        if (fieldType === 'i' || fieldType === 'ii') {
            return domElement(clusterType);    // reuse existing DOM element
        } else if (fieldType === 'iii') {
            element = domElement(clusterType). // create new DOM element
                clone(); // .addClass('hide');
            domElement('iii').append(element);
            return element;
        }
        throw TypeError("Invalid cluster type '" + clusterType + "'");
    }

    // Set all glyphs to first value in glyph list.
    function clear() {
        Object.keys(fieldNameOf).forEach(function (clusterType) {
            set({
                type   : clusterType,
                element: domElement(clusterType)
            });
        });
        domElement('i')  .children('.cluster').addClass('hide');
        domElement('ii') .children('.cluster').addClass('hide');
        domElement('iii').children('.cluster').remove();
        hideAllEmptyFieldElements();
    }

    // Populate specified cluster table (in DOM) with values.
    function set(clusterSpec) { //, cluster) {
        var clusterType    = clusterSpec.type,
            clusterElement = clusterSpec.element,
            glyphTypes     = Object.keys(dom_stuff[clusterType]);

        if (clusterElement === undefined) {
            throw TypeError("Missing 'element' property in clusterSpec");
        }
        if (clusterType === undefined) {
            throw TypeError("Missing 'type' property in clusterSpec");
        }
        if (dom_stuff[clusterType] === undefined) {
            throw TypeError("Invalid cluster type '" + clusterType + "'");
        }

        glyphTypes.forEach(function (glyphType) {
            var value = clusterSpec[glyphType] || 0,
                html  = glyphImages[glyphType][value] || value;
            $('.' + glyphType, clusterElement).html(html);
        });
        return clusterSpec;
    }

    // Show cluster in GUI. Return jQuery element for the shown cluster.
    //
    // CSS classes 'cuehide'/'cueshow' are used to indicate the cue modes.
    function show(cluster) {
        var clusterType    = cluster.get('type'),
            clusterElement = cluster.get('element'),
            glyphTypes     = Object.keys(dom_stuff[clusterType]);

        uncue();
        if (!clusterElement.hasClass('hide')) { return; }

        clusterElement.                        // cluster + field element
            add(clusterElement.closest('.field', transcriptElement)).
            removeClass('cueshow cuehide hide');

        function glyphMenu(glyphType) {
            var menuSpec     = glyphs[glyphType],
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
