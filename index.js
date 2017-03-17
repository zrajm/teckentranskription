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

function makeCluster(clusterSpec, onSet) {
    var self = { get: get, set: set },
        clusterState = {
            type    : clusterSpec.type,
            _element: gui.init(clusterSpec.type)
        };

    // Return named cluster property or, if no property is named, an object
    // with all properties except the ones beginning with '_' (= hidden
    // properties).
    function get(name) {
        return name === undefined ?
            Object.keys(clusterState).reduce(function (acc, prop) {
                if (prop[0] !== '_') { acc[prop] = clusterState[prop]; }
                return acc;
            }, {}) :
            clusterState[name];
    }

    function set(clusterSpec, value) {
        var clusterNum, glyphTypes;
        if (arguments.length === 2) {
            clusterState[clusterSpec] = value;
        } else {
            // `clusterTypes` & `clusterGlyphTypes` defined in `hashchange.js`.
            clusterNum = clusterTypes[clusterSpec.type];
            if (clusterNum === undefined) {
                throw TypeError("Invalid cluster type '" + clusterSpec.type + "'");
            }
            glyphTypes = clusterGlyphTypes[clusterNum];
            glyphTypes.forEach(function (glyphType) {
                clusterState[glyphType] = clusterSpec[glyphType] || 0;
            });
        }
        gui.set(self).show(self);
        if (this !== window && onSet) { onSet(true); }
    }

    set(clusterSpec);
    return self;
}

////////////////////////////////////////////////////////////////////////////////

function onTranscriptChange(args) {
    if (args === false) { return; }
    var fromUrl     = urlFragment.get(),
        fromStorage = fragmentStringify(transcript.get());
    if (fromUrl !== fromStorage) { urlFragment.set(fromStorage); }
}

function makeTranscript(onTranscriptChange) {
    var clusters = [], modified;
    function changed(changeStatus, eventArgs) {
        if (arguments.length === 0) { return modified; }
        onTranscriptChange(eventArgs);
        modified = !!changeStatus;
    }
    function get() {
        return clusters.map(function (cluster) {
            return cluster.get();
        });
    }
    function set(clusterSpecs, eventArgs) {
        if (!(clusterSpecs instanceof Array)) {
            console.warn("makeTranscript.set(): Argument is not an array");
            clusterSpecs = [];
        }
        gui.clear();
        clusters = clusterSpecs.map(function (clusterSpec) {
            return makeCluster(clusterSpec, changed);
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

    // Turns `clusterSpec` into cluster object and inserts that into
    // transcript. Clusters are sorted by type name, new clusters is inserted
    // in the appropriate place. If a cluster with the same type name already
    // exist, do nothing. Return true if a cluster was inserted, false
    // otherwise.
    function insertCluster(clusters, clusterSpec) {
        var i = 0, findType = clusterSpec.type;
        while (i < clusters.length && clusters[i].get('type') < findType) {
            i += 1;
        }
        // Insert cluster before cluster of different type (or last in list).
        if (clusters[i] === undefined || clusters[i].get('type') !== findType) {
            clusters.splice(i, 0, makeCluster(clusterSpec, changed));
            return true;
        }
        return false;
    }

    // Turns `clusterSpec` into cluster object and appends that to end of
    // transcript, regardless of whether the same cluster already exist or not
    // (should be used for clusters of field III). Return true if a cluster was
    // inserted, false otherwise.
    function appendCluster(clusters, clusterSpec) {
        clusters.push(makeCluster(clusterSpec, changed));
    }

    function add(clusterSpec) {
        switch (clusterSpec.type) {
        case 'ia':
        case 'ib':
        case 'iia':
        case 'iib':
        case 'iic':
            insertCluster(clusters, clusterSpec);
            break;
        case 'iiia':
        case 'iiib':
        case 'iiic':
        case 'iiid':
            appendCluster(clusters, clusterSpec);
            break;
        default:
            throw TypeError("Invalid cluster type '" + clusterSpec.type + "'");
        }
        changed(true);

        // Focus the first glyph (of last cluster of the type added).
        $('.cluster.' + clusterSpec.type).last().find('.glyph').first().focus();
    }
    return {
        add: add,
        changed: changed,
        get: get,
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
        var name = loadInputElement.val();
        transcript.set(storage.get(name));
        saveInputElement.val(name);
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
    storage.set(name, transcript.get());
    transcript.changed(false);
    updateLoadList();
    loadInputElement.val(name);
}
function buttonClear() {
    var msg = "Transcript is unsaved. – Clear it?";
    if (!transcript.changed() || confirm(msg)) {
        var name = "";
        transcript.set([]);
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
    console.log(JSON.stringify(transcript.get(), null, 4));
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

addIaButtonElement.  click(function() { transcript.add({ type: 'ia'   }) });
addIbButtonElement.  click(function() { transcript.add({ type: 'ib'   }) });
addIIaButtonElement. click(function() { transcript.add({ type: 'iia'  }) });
addIIbButtonElement. click(function() { transcript.add({ type: 'iib'  }) });
addIIcButtonElement. click(function() { transcript.add({ type: 'iic'  }) });
addIIIaButtonElement.click(function() { transcript.add({ type: 'iiia' }) });
addIIIbButtonElement.click(function() { transcript.add({ type: 'iiib' }) });
addIIIcButtonElement.click(function() { transcript.add({ type: 'iiic' }) });
addIIIdButtonElement.click(function() { transcript.add({ type: 'iiid' }) });
loadButtonElement.click(buttonLoad);
saveButtonElement.click(buttonSave);
clearButtonElement.click(buttonClear);
dumpButtonElement.click(buttonDump);
dumpThisButtonElement.click(buttonDumpThis);
deleteButtonElement.click(buttonDelete);

$(function () {
    if (transcript.get().length === 0) { buttonLoad(); }
    $('.glyph').focus();
});

/* Cluster button: Show preview of cluster to be added. */
addIaButtonElement.hover(
    function () { gui.cue('ia'); },
    function () { gui.uncue(); }
);
addIbButtonElement.hover(
    function () { gui.cue('ib'); },
    function () { gui.uncue(); }
);
addIIaButtonElement.hover(
    function () { gui.cue('iia'); },
    function () { gui.uncue(); }
);
addIIbButtonElement.hover(
    function () { gui.cue('iib'); },
    function () { gui.uncue(); }
);
addIIcButtonElement.hover(
    function () { gui.cue('iic'); },
    function () { gui.uncue(); }
);
addIIIaButtonElement.hover(
    function () { gui.cue('iiia'); },
    function () { gui.uncue(); }
);
addIIIbButtonElement.hover(
    function () { gui.cue('iiib'); },
    function () { gui.uncue(); }
);
addIIIcButtonElement.hover(
    function () { gui.cue('iiic'); },
    function () { gui.uncue(); }
);
addIIIdButtonElement.hover(
    function () { gui.cue('iiid'); },
    function () { gui.uncue(); }
);

//[eof]
