/* Copyright 2016-2017 by zrajm. Released under GPLv3 license. */

var addIaButtonElement  = $("#ia")
    addIbButtonElement  = $("#ib")
    addIIaButtonElement = $("#iia")
    addIIbButtonElement = $("#iib")
    addIIcButtonElement = $("#iic")
    addIIIaButtonElement = $("#iiia")
    addIIIbButtonElement = $("#iiib")
    addIIIcButtonElement = $("#iiic")
    addIIIdButtonElement = $("#iiid")
    bodyElement         = $(document.body),
    windowElement       = $(window),
    loadButtonElement   = $("#load"),
    loadInputElement    = $("#load-input"),
    saveButtonElement   = $("#save"),
    saveInputElement    = $("#save-input"),
    dumpButtonElement   = $("#dump"),
    dumpThisButtonElement = $("#this"),
    clearButtonElement  = $("#clear"),
    deleteButtonElement = $("#delete"),
    overlayElement      = $("#overlay"),
    statusElement       = $("#status"),
    transcript          = makeTranscript(onTranscriptChange),
    gui = makeClusterGui(function () {
        var prevClusterElem = null, prevSignElem = null;
        return {
            inElement   : $('.sign'),
            onGlyphHover: function (event) { $(event.delegateTarget).focus(); },
            onGlyphFocus: function (event) {
                var cluster = $(event.delegateTarget).closest('.cluster');
                if (prevClusterElem !== null) {
                    // Moved from glyph to glyph: Unfocus previous glyph.
                    prevClusterElem.removeClass('focus');
                } else {
                    // Moved from outside current sign: Focus sign.
                    prevSignElem = cluster.closest('.sign').addClass('focus');
                }
                prevClusterElem = cluster.addClass('focus');
            },
            onGlyphBlur: function () {
                setTimeout(function () {
                    var focusedElementIsGlyph = $(':focus').hasClass('glyph');
                    if (!focusedElementIsGlyph) {
                        prevClusterElem.add(prevSignElem).removeClass('focus');
                        prevClusterElem = null;
                    }
                }, 1);
            },
        };
    }());
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


function makeCluster(clusterStr, onSet) {
    var clusterNum = clusterStr[0];
    var self = { get: get, getNum: getNum, getStr: getStr, set: set },
        clusterState = {
            _: '',                             // cluster fragment string
            _element: gui.init(clusterNum),
        };

    function getStr() { return clusterState._; }
    function getNum() { return clusterState._[0]; }

    // Return named cluster property.
    function get(name) {
        if (name === undefined) {
            throw TypeError('No cluster property specified');
        }
        return clusterState[name];
    }

    // FIXME: Should fail if chr is not exactly one char? (if this is guarateed
    // to always be exactly one char by code elswhere then this isn't needed)
    function replaceChr(str, pos, chr) {
        return str.substr(0, pos) + chr[0] + str.substr(pos + 1);
    }

    // Replace one glyph character in cluster string.
    function setGlyph(position, glyphChar) {
        clusterState._ = replaceChr(clusterState._, position, glyphChar);
    }

    function setCluster(clusterStr) {
        // `clusterGlyphTypes` defined in `hashchange.js`.
        var clusterNum = clusterStr[0],
            glyphTypes = clusterGlyphTypes[clusterNum],
            inputChars = clusterStr.slice(1).split('');

        if (glyphTypes === undefined) {
            throw TypeError("Invalid cluster type number '" + clusterNum + "'");
        }

        // Create cluster string with one character for each glyph in the
        // cluster *definition* (= add chars missing in the input).
        clusterState._ = clusterNum +
            glyphTypes.map(function (glyphType, index) {
                return inputChars[index] || glyphData[glyphType][0];
            }).join('');
    }

    function set() {
        if (arguments.length === 2) {
            setGlyph.apply(this, arguments);
        } else {
            setCluster.apply(this, arguments);
        }
        gui.set(self).show(self);
        if (this !== window && onSet) { onSet(true); }
    }

    set(clusterStr);
    return self;
}

////////////////////////////////////////////////////////////////////////////////

// Call with `args = false` to suppress updating of URL fragment.
function onTranscriptChange(args) {
    if (args === false) { return; }
    var fromUrl     = urlFragment.get(),
        fromStorage = transcript.getStr();
    if (fromUrl !== fromStorage) { urlFragment.set(fromStorage); }
}

function makeTranscript(onTranscriptChange) {
    var clusters = [], modified;
    function changed(changeStatus, eventArgs) {
        if (arguments.length === 0) { return modified; }
        onTranscriptChange(eventArgs);
        modified = !!changeStatus;
    }
    function getStr() {
        return clusters.map(function (cluster) {
            return cluster.getStr();
        }).join('');
    }

    // Sort (and filter) clusterStrs. -- Clusters of types 1-5 are placed first
    // and sorted, clusters with numbers > 5 are placed at the end, with their
    // order retained. Any clusters with number 0 are dropped.
    function sortClusterStrs(clusterStrs) {
        var clusterStrsOther = clusterStrs.filter(function (x) {
            return (x[0] >= 1 && x[0] <= 5) ? true : false;
        }).sort(function (a, b) { return a < b ? -1 : (a > b ?  1 : 0); }),
        clusterStrsFieldIII = clusterStrs.filter(function (x) {
            return (x[0] >= 6) ? true : false;
        });
        return clusterStrsOther.concat(clusterStrsFieldIII);
    }

    // Initial substring is not returned unless it starts with a number. If
    // given empty string, returns empty list. (Adding of non-digit, plus
    // stripping off first element after split ensures this.)
    function fragmentSplit(signStr) {
        return ('@' + signStr).split(/(?=[0-9])/).splice(1);
    }

    function set(signStr, eventArgs) {
        var clusterStrs;
        if (typeof signStr !== 'string') {
            console.warn("makeTranscript.set(): Argument is not a string");
            signStr = '';
        }
        gui.clear();
        clusterStrs = sortClusterStrs(fragmentSplit(signStr));
        clusters = clusterStrs.map(function (clusterStr) {
            return makeCluster(clusterStr, changed);
        });
        changed(false, eventArgs);
    }
    function remove(clusterNumber) {
        clusters.splice(clusterNumber, 1);
        changed(true);
    }
    function move(clusterNumber, newPosition) {
        var cluster = clusters.splice(clusterNumber, 1)[0];
        if (cluster !== undefined) {
            clusters.splice(newPosition, 0, cluster);
        }
        changed(true);
    }

    // FIXME: Does the careful insertion of a cluster in right place still matter?
    // Or has some other code obsoleted this?

    // FIXME: should insertCluster return true/false (looks like we're
    // currently ignoring return value -- make sure! then rewrite)

    // Turns `clusterStr` into cluster object and inserts that into transcript.
    // Clusters are sorted by type name, new clusters is inserted in the
    // appropriate place. If a cluster with the same type name already exist,
    // do nothing. Return true if a cluster was inserted, false otherwise.
    function insertCluster(clusters, clusterStr) {
        var i = 0, findNum = clusterStr[0];
        while (i < clusters.length && clusters[i].getNum() < findNum) {
            i += 1;
        }
        // Insert cluster before cluster of different type (or last in list).
        if (clusters[i] === undefined || clusters[i].getNum() !== findNum) {
            clusters.splice(i, 0, makeCluster(clusterStr, changed));
            return true;
        }
        return false;
    }

    // Turns `clusterStr` into cluster object and appends that to end of
    // transcript, regardless of whether the same cluster already exist or not
    // (should be used for clusters of field III).
    function appendCluster(clusters, clusterStr) {
        clusters.push(makeCluster(clusterStr, changed));
    }

    function add(clusterStr) {
        var clusterNum = clusterStr[0];
        if (clusterNum >= 1 && clusterNum <= 5) {
            insertCluster(clusters, clusterStr);
        } else if (clusterNum >= 6 && clusterNum <=9) {
            appendCluster(clusters, clusterStr);
        } else {
            throw TypeError("Invalid cluster type number '" + clusterNum + "'");
        }
        changed(true);

        // Focus the first glyph (of last cluster of the type added).
        $('.cluster-' + clusterNum).last().find('.glyph').first().focus();
    }
    return {
        add: add,
        changed: changed,
        getStr: getStr,
        length: function () { return clusters.length; },
        move: move,
        remove: remove,
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
    var msg = "Transcript is unsaved. – Load new one?";
    if (!transcript.changed() || confirm(msg)) {
        var name = loadInputElement.val(),
            str  = storage.get(name);
        if (str !== null) {
            transcript.set(str);
            saveInputElement.val(name);
        }
    }
}
function buttonSave() {
    var name = saveInputElement.val();
    if (name === '') {
        alert("Cannot save transcript unless you give it a name!");
        saveInputElement.focus();
        return false;
    }
    if (name[0] === '_') {
        alert("Transcript name may not begin with an underscore!");
        saveInputElement.focus();
        return false;
    }
    if (storage.exist(name)) {
        if (!confirm("Overwrite existing transcript ‘" + name + "’?")) {
            return;
        }
    }
    storage.set(name, transcript.getStr());
    transcript.changed(false);
    updateLoadList();
    loadInputElement.val(name);
}
function buttonClear() {
    var msg = "Transcript is unsaved. – Clear it?";
    if (!transcript.changed() || confirm(msg)) {
        transcript.set('');
        saveInputElement.val("");
    }
}
function buttonDump() {
    var obj = {};
    storage.list().forEach(function (name) {
        obj[name] = storage.get(name);
    });
    console.log(JSON.stringify(obj, null, 4));
}
function buttonDumpThis() {
    console.log("'" + transcript.getStr() + "'");
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

////////////////////////////////////////////////////////////////////////////////

updateLoadList();
(function () {
    var selected = storage.getCurrentName();
    saveInputElement.val(selected);
}());

addIaButtonElement.  click(function() { transcript.add('1') });
addIbButtonElement.  click(function() { transcript.add('2') });
addIIaButtonElement. click(function() { transcript.add('3') });
addIIbButtonElement. click(function() { transcript.add('4') });
addIIcButtonElement. click(function() { transcript.add('5') });
addIIIaButtonElement.click(function() { transcript.add('6') });
addIIIbButtonElement.click(function() { transcript.add('7') });
addIIIcButtonElement.click(function() { transcript.add('8') });
addIIIdButtonElement.click(function() { transcript.add('9') });
loadButtonElement.click(buttonLoad);
saveButtonElement.click(buttonSave);
clearButtonElement.click(buttonClear);
dumpButtonElement.click(buttonDump);
dumpThisButtonElement.click(buttonDumpThis);
deleteButtonElement.click(buttonDelete);

$(function () {
    if (transcript.getStr() === '') { buttonLoad(); }
    $('.glyph').focus();
});

/* Cluster button: Show preview of cluster to be added. */
addIaButtonElement.hover(
    function () { gui.cue('1'); },
    function () { gui.uncue(); }
);
addIbButtonElement.hover(
    function () { gui.cue('2'); },
    function () { gui.uncue(); }
);
addIIaButtonElement.hover(
    function () { gui.cue('3'); },
    function () { gui.uncue(); }
);
addIIbButtonElement.hover(
    function () { gui.cue('4'); },
    function () { gui.uncue(); }
);
addIIcButtonElement.hover(
    function () { gui.cue('5'); },
    function () { gui.uncue(); }
);
addIIIaButtonElement.hover(
    function () { gui.cue('6'); },
    function () { gui.uncue(); }
);
addIIIbButtonElement.hover(
    function () { gui.cue('7'); },
    function () { gui.uncue(); }
);
addIIIcButtonElement.hover(
    function () { gui.cue('8'); },
    function () { gui.uncue(); }
);
addIIIdButtonElement.hover(
    function () { gui.cue('9'); },
    function () { gui.uncue(); }
);

//[eof]
