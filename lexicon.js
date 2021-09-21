/* jshint esversion: 6, browser: true, jquery: true, laxbreak: true */
/* globals lexicon, lexiconDate */

// String method `STR.supplant(OBJ)`. Replace all {...} expressions in STR with
// OBJ property of same name. Return the new string.
//
//   'Hello {str}!'.supplant({str: 'world'})       => 'Hello world!'
//   'Hello {0} & {1}!'.supplant(['Alice', 'Bob']) => 'Hello Alice & Bob!'
//
String.prototype.supplant = function (o) {
    'use strict';
    return this.replace(/\{([^{}]*)\}/g, function (a, b) {
        var r = o[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
    });
};

// jQuery plugin to insert a string at caret position in <textarea> &
// <input> and also scroll element content to caret after paste. (Does
// not work with 'contenteditable'.)
//
// Uses .selectionStart/.selectionEnd, i.e. works on:
// Chrome, Firefox, MSIE 9+, Edge, Safari 4+, Opera, Android etc.
jQuery.fn.paste = function(str) {
    'use strict';
    var prefocused = document.activeElement;
    str += '';                            // make sure it's a string
    this.each(function (_, el) {
        var beg = el.selectionStart;
        var val = el.value;

        // Insert string & move caret.
        el.value = val.slice(0, beg) + str + val.slice(el.selectionEnd);
        el.selectionEnd = el.selectionStart = beg + str.length;

        // Scroll content to caret (non-DOM, non-chainable).
        el.blur();
        el.focus();
    });
    prefocused.focus();
    return this;
};

// Toggle fullscreen for one element or (with no arg) the whole window.
// [thewebflash.com/toggling-fullscreen-mode-using-the-html5-fullscreen-api]
function toggleFullscreen(elem) {
    'use strict';
    elem = elem || document.documentElement;
    if (
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
    ) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    } else {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
//
// Overlay module (for help text).
//
//   .hide() -- Hides currently open overlay.
//
(function () {
    var button = $('a[href="#help"]');
    var overlay = $('.overlay.help');

    // Convert <tt> into links (except if they contain '…') by replacing
    // '<tt>…</tt>' with '<a class=tt href="#…">…</a>'.
    overlay.find('tt').replaceWith(function () {
        var jq = $(this);
        var link = '#' + jq.text().replace(/\s+/g, ' ');
        return link.match(/…/)
            ? this
            : $('<a>', { class: 'tt', href: link })
                .click(hideOverlay)
                .append(jq.contents());
    });
    function hideOverlay () {
        overlay.hide();
        button.focus();
    }
    function showOverlay (e) {
        e.preventDefault();
        overlay.show().find('>*').focus();
    }
    button.click(showOverlay);
    overlay.keyup(function (e) {
        if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) { return; }
        if (e.key === 'Escape') {
            hideOverlay();
        }
    }).on('mouseover mouseout click', function (e) {
        var elem = e.target, type = e.type;
        if (elem === this) {
            elem = $(elem);
            if (type === 'mouseover') {
                elem.addClass('hover');
            } else if (type === 'mouseout') {
                elem.removeClass('hover');
            } else if (type === 'click') {
                elem.hide();
            }
        }
    });
}());

////////////////////////////////////////////////////////////////////////////////
//
// URL fragment state module
// =========================
// Update URL fragment & trigger on URL fragment change.
//
// URL fragment syntax: {#|##}<query>[/<overlay>]
// ----------------------------------------------
//   * A single '#' (default) indicates that matches should be displayed with
//     videos, while '##' indicate a text only listing is desired.
//   * <query> is a search query (described elsewhere). Search query may
//     contain URL encdoded slashes.
//   * <overlay> (if specified) is the name of an overlay (to be displayed on
//     top of the page). Overlays are built into the HTML structure of the
//     page, but eventually there will be dynamic overlays for all the words of
//     the dictionary (in which case the <overlay> will be the 5-digit ID of
//     the word in question).
//
// Functions
// ---------
// .set(STATE) -- Change URL to reflect state (without triggering hooks).
// .onOverlayChange(FUNC) -- Register FUNC as callback for corresponding event.
// .onQueryChange(FUNC)
// .onVideoToggle(FUNC)
//
// Register FUNC as callback, called when corresponding part of the URL change.
//
// State
// -----
// The state object reflects the URL but the separators are removed, and all
// strings have been decoded. The 'video' value is javascript boolean.
//
//   {
//       base   : 'http://zrajm.github.io/teckentranskription/lexicon.html',
//       overlay: '',
//       query  : 'buss,taxi',
//       video  : true,
//   };
//
var urlFragment = (function () {
    'use strict';
    var state = { overlay: '', query: undefined, video: true };
    function getStateFromUrl() {
        var x = window.location.href
            .match(/^([^#]*)(?:(#*)([^#\/]*)(?:\/([^#\/]*))?)/u).slice(1);
        return {
            base   : x[0],
            overlay: decodeURIComponent(x[3] || ''),
            query  : decodeURIComponent(x[2]),
            video  : (!x[1] || x[1] === '#' ? true : false)
        };
    }
    function setUrlFromState(state) {
        var str = encodeURIComponent(state.query) +
            (state.overlay ? ('/' + encodeURIComponent(state.overlay)) : '');
        if (str || state.video !== undefined) {
            str = (state.video ? '#' : '##') + str;
        }
        return state.base + str;
    }
    function getHashFromStr(hashStr) {
        var x = hashStr.split('/');
        var queryStr = x[0] || state.query;
        var overlayStr = x[1];
        return (state.video ? '#' : '##') +
            encodeURIComponent(queryStr) +
            (overlayStr ? ('/' + encodeURIComponent(overlayStr)) : '');
    }
    // .set({ query: STR, video: BOOL, overlay: STR })
    // Update internal state + URL, without triggering hashchange event.
    function setState(partial) {
        var modified = false;
        ['overlay', 'query', 'video'].forEach(function (n) {
            if (partial[n] !== state[n] && partial[n] !== undefined) {
                state[n] = partial[n];
                modified = true;
            }
        });
        if (modified) {                         // update URL
            window.history.pushState({}, '', setUrlFromState(state));
            return true;
        }
        return false;
    }

    var hooks = {};
    function onOverlayChange(callback) { hooks.overlay = callback; }
    function onQueryChange(callback)   { hooks.query = callback; }
    function onVideoToggle(callback)   { hooks.video = callback; }
    $(window).on('hashchange', function () {
        var newState = getStateFromUrl();
        var run = [];
        ['base', 'overlay', 'query', 'video'].forEach(function (n) {
            if (newState[n] !== state[n]) {    // save all state first
                if (hooks[n] instanceof Function) {
                    run.push(n);               //   register callback to run
                }
                state[n] = newState[n];        //   save state
            }
        });
        run.forEach(function (n) {             // run callbacks
            hooks[n](state[n]);
        });
    });

    // Trigger hashchange on initial page load.
    $(function () { $(window).trigger('hashchange'); });

    return {
        set: setState,
        getHash: getHashFromStr,
        onOverlayChange: onOverlayChange,
        onQueryChange: onQueryChange,
        onVideoToggle: onVideoToggle
    };
}());

////////////////////////////////////////////////////////////////////////////////
//
// Timer logging module -- Output msg on console, replacing '%s' in msg with
// time in seconds or milliseconds (rounded to 3-4 digits).
//
//   .reset() -- reset time
//   .step(MSG) -- display MSG, replace %s with time since last msg
//   .total(MSG) -- display MSG, replace %s with time since last reset
//
var logTiming = (function (perf, log) {
    'use strict';
    var timeFirst;
    var timeLast;
    function reset() {
        timeFirst = perf.now();
        timeLast = timeFirst;
    }
    function prefix(ms) {
        var str = ms > 1000
            ? (ms / 1000 + 0.5) + 's'  // seconds
            : (ms + 0.5) + 'ms';       // milliseconds
        return str.replace(/^([.0-9]{0,3}[0-9]?)[.0-9]*([a-z]+)/, '$1$2');
    }
    function timeSince(time) {
        return prefix(perf.now() - time);
    }
    function total(msg) {
        log(msg.replace(/%s/, timeSince(timeFirst)));
    }
    function step(msg) {
        log(msg.replace(/%s/, timeSince(timeLast)));
        timeLast = perf.now();
    }
    reset();
    return {
        reset: reset,  // reset timer
        step: step,    // output time since last msg
        total: total   // output time since reset
    };
}(window.performance, window.console.log));

////////////////////////////////////////////////////////////////////////////////
//
// Functions
//

// Parse a user-inputted query string and return a QUERY array.
//
// Search Query Syntax
// ===================
// A search QUERY contains one or more TERMs (separated by space) all TERMs
// must me found in an entry for that entry to match (they are AND:ed). A TERM
// can also be negated by preceding it with '-'.
//
// If a search contains more than one SUBQUERY (separated by comma) only one
// SUBQUERY need to match for an entry to match (they are OR:ed).
//
// A TERM can be partially or fully quoted (with ' or "). Text in quotes is
// always interpreted literally, outherwise some characters (space, comma,
// minus etc.) have special meaning.
//
// Part of a TERM can be quoted >like*" this"< (to match something starting
// with 'like' and ending in the separate word ' this'). An unlimited number of
// parts may be quoted. Spaces inside quotes are interpreted literally, while
// spaces outside considered separators between search TERMs.
//
// Return Search Structure
// =======================
// Returns a QUERY data structure consisting of an array of subqueries. The
// root query structure also has a property 'hilite' (containing a regex to
// mark all matches). If any one subquery match an entry, then that result
// should be returned in the result. Each subquery in turn consist of a an
// object containing the following properties:
//
// * 'include' -- array of regexes that must ALL be found
// * 'exclude' -- array of regexes that must all be absent
//
function parseQuery(queryStr) {
    'use strict';

    // Escape all regular expression metacharacters & the regex delimiter '/'.
    function quotemeta(str) {
        // PCRE/ERE:          *+? ^$. [  { ()|   \
        // MSIE meta + delim: *+? ^$. [ ]{}()| / \
        return str.replace(/^[*+?\^$.\[\]{}()|\/\\]$/u, '\\$&');
    }

    var queryBuilder = (function () {
        var query = [];
        var negative;

        function str2regex(regex) {
            return new RegExp(regex, 'gui');
        }
        function addSubquery() {
            query.push({
                include: [],
                exclude: []
            });
            negative = false;
        }
        var nonWord = '[ 􌥠,:!?/.’()[\\]&+–]'; // (FIXME: Removed: '-')
        var leadingNonAlpha  = new RegExp('^' + nonWord, 'ui');
        var trailingNonAlpha = new RegExp(nonWord + '$', 'ui');
        function addTerm (term, plainTerm, type) {
            if (term !== '') {
                term = type === 'field'
                    ? '^' + term + '$'          // entire field
                    : (plainTerm.match(leadingNonAlpha)  ? '()' : '(' + nonWord + '|^)') +
                      '(' + term + ')' +
                      (plainTerm.match(trailingNonAlpha) ? '' : '(?=' + nonWord + '|$)');
                query[query.length - 1][
                    negative
                        ? 'exclude'
                        : 'include'
                ].push(term);
                negative = false;
            }
        }

        addSubquery();
        return {
            addSubquery: addSubquery,
            addTerm: addTerm,
            getQuery: function getQuery() {
                // Return array with global 'hilite' propetry.
                return Object.assign(query.reduce(
                    (acc, subq) => !(subq.include.length || subq.exclude.length)
                        ? acc
                        : acc.concat({         // add non-empty subquery
                            exclude: subq.exclude.map(str2regex),
                            include: (
                                // If all terms are negated, add implicit '*'.
                                subq.include.length ? subq.include :  ['']
                            ).map(str2regex)
                        }),
                    []
                ), {
                    hilite: str2regex(query.reduce(
                        (acc, subq) => acc.concat(subq.include), []
                    ).join('|'))
                });
            },
            negative: function () {
                negative = true;
            }
        };
    }());
    var metachars = {
        'a': '[aàáâã]',
        'c': '[cç]',
        'e': '[eèéêë]',
        'i': '[iìíîï]',
        'n': '[nñ]',
        'o': '[oòóôõ]',
        'u': '[uùúûü]',
        'y': '[yýü]',
        'ä': '[äæ]',
        'ö': '[öø]',
        '􌤆': '[􌤆􌤂􌥞􌤀􌤃􌤄􌤅􌤾􌤈􌤇􌤉􌤋􌤊􌤼􌤌􌤛][􌤺􌥛􌤻􌤹􌥚]?', // face
        '􌤂': '[􌤂􌤀􌤃􌤄􌤅􌤾􌤈􌤇􌤉􌤋􌤊􌤼][􌤺􌥛􌤻􌤹􌥚]?',     // upper face
        '􌥞': '[􌥞􌤾􌤈􌤇􌤉􌤋􌤊􌤼􌤌􌤛][􌤺􌥛􌤻􌤹􌥚]?',       // lower face
        '􌥜': '[􌥜􌤑􌦲􌤒][􌤺􌥛􌤻􌤹􌥚]?',             // arm
        '􌤠': '[􌤠􌥀􌤡][􌤺􌥛􌤻􌤹􌥚]?',              // shoulders
        '􌤓': '[􌤓􌤕􌤔][􌤺􌥛􌤻􌤹􌥚]?',              // chest
        '􌤗': '[􌤗􌤙􌤘][􌤺􌥛􌤻􌤹􌥚]?',              // hips
        '*': '[^ 􌥠/.,:;?!()]*',  // all non-space, non-'/' delimiter
        '@':                     // one place symbol (+ optional relation)
                '(?:@|[􌦳􌤆􌤂􌥞􌤀􌤃􌤄􌤅􌤾􌤈􌤇􌤉􌤋􌤊􌤼􌤌􌤛􌤜􌤞􌤠􌥀􌤡􌥜􌤑􌦲􌤒􌤓􌤕􌤔􌤖􌤗􌤙􌤘􌤚][􌤺􌥛􌤻􌤹􌥚]?)',
        '#':                     // one handshape symbol (+ optional relation)
                '(?:#|[􌤤􌥄􌤣􌤧􌥋􌥉􌦫􌤩􌤎􌥇􌦬􌤦􌤲􌤱􌥑􌤢􌥂􌤪􌥎􌥈􌤨􌤿􌥌􌥆􌤫􌦭􌤬􌥅􌤥􌥊􌦱􌤽􌤯􌤭􌤮􌤰􌤳􌥃􌥒􌥟􌦪][􌤺􌥛􌤻􌤹􌥚]?)',
        '^': '[􌤺􌥛􌤻􌤹􌥚]',          // one relation symbol
        ':': '[􌥓􌥔􌤴􌥕􌤵􌥖][􌤶􌥗􌤷􌥘􌤸􌥙]', // one attitude symbol
        '􌦮': '(?:􌦮[􌦈􌥽􌦉􌥾􌦊􌦋􌥿􌦀􌦌􌦂􌦵]?|􌥰[􌥿􌦀􌦌])', // circle in frontal plane
        '􌦯': '(?:􌦯[􌦈􌥽􌦉􌥾􌦊􌦋􌥿􌦀􌦌􌦂􌦵]?|􌥰[􌦈􌥽􌦉])', // circle in horisontal plane
        '􌦰': '(?:􌦰[􌦈􌥽􌦉􌥾􌦊􌦋􌥿􌦀􌦌􌦂􌦵]?|􌥰[􌥾􌦊􌦋])', // circle in saggital plane
    };
    // Unquoted place/handshape symbols should also match a following
    // (optional) relation symbol.
    for (let c of '􌦳􌤀􌤃􌤄􌤅􌤾􌤈􌤇􌤉􌤋􌤊􌤼􌤌􌤛􌤜􌤞􌥀􌤡􌤑􌦲􌤒􌤕􌤔􌤖􌤙􌤘􌤚􌤤􌥄􌤣􌤧􌥋􌥉􌦫􌤩􌤎􌥇􌦬􌤦􌤲􌤱􌥑􌤢􌥂􌤪􌥎􌥈􌤨􌤿􌥌􌥆􌤫􌦭􌤬􌥅􌤥􌥊􌦱􌤽􌤯􌤭􌤮􌤰􌤳􌥃􌥒􌥟􌦪') {
        metachars[c] = `${c}[􌤺􌥛􌤻􌤹􌥚]?`;
    }
    // All unquoted hand-external motion symbols (circling/bouncing/curving/
    // hitting/twisting/divering/converging) should also match a following
    // (optional) motion direction symbol.
    for (let c of '􌥯􌦶􌥰􌥱􌥲􌥹􌦅') {
        metachars[c] = `${c}[􌦈􌥽􌦉􌥾􌦊􌦋􌥿􌦀􌦌􌦂􌦵]?`;
    }
    // Process query char-by-char in FSA.
    let term = '', plainTerm = '', quote = '', type = 'word', fsa = {
        ',': c => {
            queryBuilder.addTerm(term, plainTerm, type);
            queryBuilder.addSubquery();
            type = 'word';
            term = '';
            plainTerm = '';
        },
        ' ': c => {
            queryBuilder.addTerm(term, plainTerm, type);
            type = 'word';
            term = '';
            plainTerm = '';
        },
        '"': c => { quote = c },
        "'": c => { quote = c },
        'UNQUOTED': c => {
            if (term === '') {             //   leading
                if (c === '-') {           //     '-' (negation)
                    queryBuilder.negative();
                    return;
                } else if (c === '=') {    //     '=' (exact match)
                    type = 'field';
                    return;
                }
            }
            term += metachars[c] || quotemeta(c);
            plainTerm += c;
        },
        'QUOTED': c => {
            if (c === quote) {
                quote = '';
            } else {
                term += quotemeta(c);
                plainTerm += c;
            }
        },
    };
    for (let c of queryStr.normalize()) {
        fsa[quote ? 'QUOTED' : fsa[c] ? c : 'UNQUOTED'](c);
    }
    queryBuilder.addTerm(term, plainTerm, type);
    return queryBuilder.getQuery();
}

// Return true if at least one element in entry matches regex. (The
// `regex.lastIndex` property is modified by this function).
function regexInEntry(regex, entry) {
    'use strict';
    // `lastIndex` is set to make sure that search start at beginning of
    // string, even when regex flag /g is used.
    regex.lastIndex = 0;
    return entry.some(function (field) {
        return regex.test(field);
    });
}

// Subquery is an object with the properties:
// * 'include' -- array of regexes that must ALL be found
// * 'exclude' -- array of regexes that must all be absent
function subqueryInEntry(subquery, entry) {
    'use strict';
    return subquery.include.every(function (re) {// all positive terms and
        return regexInEntry(re, entry);
    }) && !subquery.exclude.some(function (re) { //   no negative terms matches
        return regexInEntry(re, entry);
    });
}

// Return matching subquery number or -1 if no subquery match. (To get
// truthiness, do binary not ['~'] on returned value.)
function queryInEntry(query, entry) {
    'use strict';
    return query.some(function (subquery) {
        return subqueryInEntry(subquery, entry);
    });
}

function hilite(str, regex, func) {
    'use strict';
    return str.replace(regex, function (match, ...parts) {
        parts = parts.slice(0,-2).filter((p) => p !== undefined);
        if (func) {
            func();
        }
        // Lookbeind (?<=...) isn't supported in Safari (and was only added to
        // Edge and Firefox in summer 2020), therefore we use regex subgroups
        // instead.
        return '{0}<mark>{1}</mark>'.supplant(
            (parts.length === 2) ? parts : ['', match]
        );
    });
}

function htmlifyTags(tags, hiliteRegex) {
    // Tag count starts at -1 to compensate for the tag counter (e.g. '/1').
    var count = { tag: -1, warn: 0 }, match = { tag: false, warn: false }, html;
    if (tags.length === 1) {
        return '';
    }
    // Generate tag list and count matches, and number of tags/warnings.
    html = tags.map((tag) => {
        // Determine tag type (warning = add warning icon).
        var tagType = tag.match(/\/ovanligt/) ? 'warn' : 'tag';
        count[tagType] += 1;
        return hilite(tag, hiliteRegex, () => {
            match[tagType] = true;
        })
            .replace(/(^|[^<])\//g, '$1<span class=sep>/</span>') +
            (tagType === 'warn' ? ' <span class=sep>▲</span>' : '');
    });
    return '<span class=tags title="{tags}{help}">{icons}</span>'.supplant({
        tags: html.join('<br>'),
        help: ' <span class=sep>(antal taggar)</span>',
        icons: ['warn', 'tag'].map((tagType) => {
            return count[tagType] === 0
                ? ''
                : '<img src="pic/{type}{match}.svg" alt="{alt}">'
                .supplant({
                    type: tagType,
                    match: match[tagType] ? '-marked' : '',
                    alt:   match[tagType] ? 'Ovanligt' : 'Taggar',
                });
        }).join(''),
    });
}

// Turn a (hilited) transcription string into HTML.
function htmlifyTranscription(hilitedTransStr) {
    'use strict';
    return hilitedTransStr
        // Insert <wbr> tag after all segment separators.
        .replace(/􌥠/gu, '􌥠<wbr>');
}

// Downcase string, remove all non-alphanumenic characters and space (by
// replacing Swedish chars with aao, and space with '-') and collapse all
// repetitions of '-'.
function unicodeTo7bit(str) {
    return str.toLowerCase().replace(/[^a-z0-9-]/gu, function (m) {
        return {
            ' ': '-', 'é': 'e', 'ü': 'u', 'å': 'a', 'ä': 'a', 'ö': 'o', '–': '-',
        }[m] || '';
    }).replace(/-{2,}/, '-');
}

function htmlifyMatch(entry, hiliteRegex) {
    'use strict';
    var id = entry[0];                         // 1st field
    var transcr = entry[1];                    // 2nd field
    var swe = entry.slice(2).filter(x => x[0] !== '/');  // Swedish
    var tags = entry.slice(2).filter(x => x[0] === '/');  // /tags
    return (
        /* NB: Whitespace below shows up in search result's 'text' mode. */
        '<div class=match>' +
            '<div class="video-container is-loading">' +
                '<img src="{baseUrl}/photos/{dir}/{file}-{id}-tecken.jpg"' +
                ' data-video="{baseUrl}/movies/{dir}/{file}-{id}-tecken.mp4" alt="">' +
                '<div class=video-feedback></div>' +
                '<div class=top-right style="text-align:right">' +
                    '<a class=video-id href="{baseUrl}/ord/{id}"' +
                        ' title="Öppna i Svenskt tecken­språks­lexikon (i ny tabb)"' +
                        ' target=_blank rel="noopener">{htmlId}</a>\n' +
                    '{htmlTags}\n' +
                '</div>' +
                '<div class=video-subs>' +
                    '<a data-href="{transcr}" title="{htmlTranscr}">' +
                        '{htmlTranscr}</a>' +
                '</div>' +
            '</div> ' +
            '<span title="{htmlSwedish}">{htmlSwedish}</span>' +
        '</div>\n'
    ).supplant({
        htmlTags: htmlifyTags(tags, hiliteRegex),
        id: id,
        htmlId: hilite(id, hiliteRegex),
        baseUrl: 'https://teckensprakslexikon.su.se',
        dir: id.substring(0, 2),
        file: unicodeTo7bit(swe[0]),
        transcr: transcr,
        htmlTranscr: htmlifyTranscription(hilite(transcr, hiliteRegex)),
        htmlSwedish: swe.map(function (txt) {
            return hilite(txt, hiliteRegex);
        }).join(', ')
    });
}

// A function that interatively displays the result of a search. `chunksize`
// items are displayed at a time, thereafter an additional `chunksize` items
// are shown if user scrolls to the end of the page or press the 'Show more…'
// button.
//
// If the function is invoked again with a new search result, then any still
// ongoing processing is aborted and only the new result is displayed.
var outputMatching = (function () {
    'use strict';
    var chunksize = 100;                       // setting (never changes)
    var hasListener = false;
    var statusElem;
    var resultElem;
    var buttonElem;
    var htmlQueue;
    var startSize;
    var count;

    function scrolledToBottom() {
        var pageOffset = window.pageYOffset || window.scrollY;
        var pageHeight = document.body.offsetHeight;
        var winHeight = window.innerHeight;
        return (pageOffset + winHeight >= pageHeight - 2) ? true : false;
    }

    function outputNext(args) {
        var chunk;
        if (args) {
            statusElem = args.status;
            resultElem = args.result;
            buttonElem = args.button;
            htmlQueue = args.html;
            startSize = htmlQueue.length;
            count = 0;
        }

        // Output one chunk of search result.
        chunk = htmlQueue.splice(0, chunksize);
        count += chunk.length;
        if (count === startSize) {
            statusElem.html('{0} träffar (visar alla)'.supplant([count]));
        } else {
            statusElem.html(
                '{1} träffar (visar {0}) – <a>Visa {2} till</a>'
                    .supplant([count, startSize, chunksize])
            );
            $('>a',statusElem).click(function () { outputNext(); });
        }

        resultElem.append(chunk.join(''));
        resultElem.imagesLoaded().progress(onImageLoad);

        if (htmlQueue.length === 0) {          // nothing more to display
            buttonElem.hide();
            $(window).off('scroll');
        } else {                               // moar to display
            if (!hasListener) {
                buttonElem.click(function () { outputNext(); });
                hasListener = true;
            }
            if (args) {
                buttonElem.show();
                $(window).on('scroll', function () {
                    if (scrolledToBottom()) {
                        outputNext();
                    }
                });
            }
        }
    }
    return outputNext;
}());

function onImageLoad(imgLoad, image) {
    // change class if image is loaded or broken
    var parentElem = $(image.img).parent();
    parentElem.removeClass('is-loading');
    if (!image.isLoaded) {
        parentElem.addClass('is-broken');
    }
}

function searchLexicon(queryStr) {
    'use strict';
    var $body = $(document.body);

    $('#q').val(queryStr);
    setTimeout(function () {
        var query = parseQuery(queryStr);
        logTiming.reset();
        var matches = (query.length === 0) ? [] : lexicon.reduce(
            (acc, entry) => queryInEntry(query, entry)
                ? acc.concat([entry])
                : acc,
            []
        );
        logTiming.total('Search took %s.');

        // Query without matches, add 'nomatch' to <body>.
        $body[(query.length && matches.length === 0) ? 'addClass' : 'removeClass']('nomatch');

        // No query, add 'noquery' to body element.
        $body[query.length ? 'removeClass' : 'addClass']('noquery');

        // Output search result.
        outputMatching({
            status: $('#search-count'),
            result: $('#search-result').empty(),
            button: $('#more'),
            html: matches.map(entry => htmlifyMatch(entry, query.hilite))
        });
    }, 0);
}

function onPlayPauseToggle(event) {
    'use strict';
    var feedbackElem;
    if ($(event.target).is('a')) {             // a link was clicked: abort
        return;
    }
    var $container = $(event.currentTarget);
    var $video = $('>video,>img[data-video]', $container);

    if ($video.is('img')) {                    // replace <img> with <video>
        $video = $(
            '<video loop muted playsinline src="{0}" poster="{1}"></video>'
                .supplant([$video.data('video'), $video.attr('src')])
        ).replaceAll($video).on('canplay error', function (e) {
            $video.off('canplay error');
            $container.removeClass('is-loading-video is-broken');
            if (e.type === 'error') {
                $container.addClass('is-broken');
            }
        });
        $container.addClass('is-loading-video');
    }

    // Get state of video and toggle play/pause state.
    // (Everything that remains after this is visual feedback.)
    var action = $video.prop('paused') ? 'play' : 'pause';
    $video.trigger(action);

    // Add icon to feedback overlay & animate it.
    feedbackElem = $('>.video-feedback', $container)
        .removeClass('anim pause play')
        .addClass(action);                     // display play/pause icon
    setTimeout(function () {                   // animate icon
        feedbackElem
            .addClass('anim')
            .one('transitionend', function() {
                feedbackElem.removeClass('anim pause play');
            });
    }, 10);
}

$('#search-result')
    .on('click', '.video-container', onPlayPauseToggle)
    .on('dblclick', '.video-container', function (event) {
        toggleFullscreen($('>video', event.currentTarget)[0]);
    });

// On window resize: Rescale #search-result element in steps.
{
    const $win = $(window);
    const $div = $('#search-result');
    const gapWidth = parseInt($div.css('word-spacing'), 10);
    const colWidth = 270;                      // same as .video-container in CSS
    let oldWidth, oldCols;
    $win.on('load resize', () => {
        const width = $win.width();
        if (width === oldWidth) {              // window width unchanged
            return;
        }
        const cols = Math.floor((width + gapWidth) / (colWidth + gapWidth)) || 1;
        if (cols === oldCols) {                // number of columns unchanged
            return;
        }
        $div.css('width', (gapWidth * (cols - 1)) + (colWidth * cols));
        oldWidth = width;
        oldCols = cols;
    });
}

// Tooltips: These imitate Chromium tooltip behaviour, but allow us to use any
// font -- so that sign language transcriptions can be displayed.
(function () {
    var timeout;
    var shown = false;
    var $tooltip = $('<div class=tooltip></div>').appendTo(document.body).css({
        display: 'none', color: '#fff', background: '#555', borderRadius: 2,
        boxShadow: '0 2px 6px rgba(0, 0, 0, .25)', fontSize: 16,
        lineHeight: '1.6', padding: '.5em', position: 'fixed',
        zIndex: 2147483647 /* max allowed */
    });

    // Trigger event if pointer is non-moving for half a second.
    $(document.body).on('mouseover', '[title],[data-title]', function (event) {
        var $e = $(event.currentTarget);
        var value = $e.attr('title');

        // Change attribute 'title' => 'data-title' to suppress browser tooltip.
        if (value !== undefined) {
            $e.attr('data-title', value).removeAttr('title');
        }

        clearTimeout(timeout);
        timeout = setTimeout(function () {
            if ($e.is(':visible') && $e.is(':hover')) {
                onMouseStill(event);
            }
        }, 500);
    });

    function onMouseStill(event) {
        var x = event.clientX + 10;
        var y = event.clientY + 10;

        // Display topleft to get height + width.
        shown = true;
        $tooltip
            .css({ left: 0, top: 0 })
            .html($(event.currentTarget).data('title'))
            .show();

        // Now use height and width of displayed tooltip, to move it to the
        // right place (making sure it doesn't stick out of right/bottom corner
        // of window).
        var xMax = $(window).width()  - $tooltip.outerWidth();
        var yMax = $(window).height() - $tooltip.outerHeight();
        $tooltip.css({
            left: x < xMax ? x : (xMax < 0 ? 0 : xMax),
            top:  y < yMax ? y : (yMax < 0 ? 0 : yMax),
        });
    }

    function hideTooltip() {
        if (shown) {
            shown = false;
            $tooltip.hide();
        }
    }
    $(window).on('hashchange resize', hideTooltip);
    $(document).on('scroll mousemove mousedown keydown', hideTooltip);
}());

////////////////////////////////////////////////////////////////////////////////
//
// Main program
//

// URL update events, these are triggered when user follows a page internal
// link, when user manually edits URL, and on initial page load. These hooks
// update internal state to reflect URL change (without causing any additional
// changes to URL).
urlFragment.onQueryChange(searchLexicon);
urlFragment.onVideoToggle(showVideos);

// Form submission.
$(function () {
    'use strict';
    var $form = $('#search')
        .on('submit', onSubmit);
    var $q = $('#q')
        .on('focus blur', onFocus)
        .on('keydown', onKey)
        .on('paste', onPaste);
    onFocus();

    // Text input '#q' focused = set 'focused' class on wrapper element.
    function onFocus() {
        $form.toggleClass('focus', $q.is(':focus'));
    }
    // Return key in textarea = submit form.
    function onKey(e) {
        if (e.which === 13) {                   // Enter
            e.preventDefault();                 //   don't insert key
            if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
                return;
            }
            $form.submit();
        }
    }
    // Form submission.
    function onSubmit(e) {
        var queryStr = $q.val() || '';
        e.preventDefault();                     // don't submit to server
        // On touchscreen devices (where no input type has hover).
        if (window.matchMedia('not all and (any-hover:hover)').matches) {
            $q.blur(); // hide soft keyboard
        }
        urlFragment.set({ query: queryStr }) && searchLexicon(queryStr);
    }
    // Paste in textarea = filter out newlines (use jQuery .paste plugin).
    function onPaste(e) {
        if ($q[0].selectionEnd === undefined) { // if unsupported: do nothing
            return;
        }
        e.preventDefault();
        $q.paste(
            (
                window.clipboardData !== undefined
                ? window.clipboardData          // MSIE, Safari, Chrome
                : e.originalEvent.clipboardData // WebKit
            ).getData('text').replace(/[\n\r\u0020]+/g, ' ')
        ).trigger('input');
    }
});

// Update lexicon date in page footer.
(function () {
    'use strict';
    function updateLexiconDate() {
        if (lexiconDate === undefined) {
            setTimeout(updateLexiconDate, 250);
        } else {
            $('#lexicon-date').html(lexiconDate.toLocaleString(
                'sv', { year: 'numeric', month: 'long', day: 'numeric' }
            ));
            $('#lexicon-size').html(
                (Object.keys(lexicon).length + '')
                    .replace(/(?=([0-9]{3})+$)/g, ' ')
            );
        }
    }
    $(updateLexiconDate);
}());

function showVideos (bool) {
    $('#search-wrapper')
        .removeClass('video-view text-view')
        .addClass(bool ? 'video-view' : 'text-view');
}
$('#search-wrapper .selector').on('click keypress', function(e) {
    if (e.type === 'keypress') {
        if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) { return; }
        if (e.which !== 13 && e.which !== 32) { return; }
    }
    var hasVideo = $('#search-wrapper')
        .toggleClass('video-view text-view')
        .hasClass('video-view');
    urlFragment.set({ video: hasVideo });
});

// Update 'href' attr when mouse enters <a data-href=…> tag (used to retain
// current video/text result setting). 'data-href' syntax: [query][/overlay]
$(function () {
    'use strict';
    // 'mouseenter' used here since it does not trigger when child elements are
    // entered, and the event does not bubble.
    $('#search-result').on('mouseenter', 'a[data-href]', function (e) {
        var $e = $(e.currentTarget);
        var hashref = $e.data('href') || '';
        if (hashref) {
            $e.attr('href', urlFragment.getHash(hashref));
        }
    });
});

//[eof]
