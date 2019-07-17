/*jslint browser fudge */
/*global window $ lexicon lexiconDate */

// String method `STR.supplant(OBJ)`. Replace all {...} expressions in STR with
// OBJ property of same name. Return the new string.
//
//   "Hello {str}!".supplant({str: "world"})       => "Hello world!"
//   "Hello {0} & {1}!".supplant(["Alice", "Bob"]) => "Hello Alice & Bob!"
//
String.prototype.supplant = function (o) {
    "use strict";
    return this.replace(/\{([^{}]*)\}/g, function (a, b) {
        var r = o[b];
        return typeof r === "string" || typeof r === "number" ? r : a;
    });
};

// Toggle fullscreen for one element or (with no arg) the whole window.
// [thewebflash.com/toggling-fullscreen-mode-using-the-html5-fullscreen-api]
function toggleFullscreen(elem) {
    "use strict";
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
var overlay = (function () {
    var button = $("#help");
    var overlay = $(".overlay.help");

    // Convert <tt> into links (except if they contain '…') by replacing
    // '<tt>…</tt>' with '<a class=tt href="#…">…</a>'.
    overlay.find('tt').replaceWith(function () {
        var jq = $(this);
        var link = "#" + jq.text().replace(/\s+/g, " ");
        return link.match(/…/)
            ? this
            : $("<a>", { class: "tt", href: link })
                .click(hideOverlay)
                .append(jq.contents());
    });
    function hideOverlay () {
        overlay.hide();
        button.focus();
    }
    function showOverlay () {
        overlay.show().find('>*').focus();
    }
    button.click(showOverlay);
    overlay.keyup(function (e) {
        if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) { return; }
        if (e.key === "Escape") {
            hideOverlay();
        }
    }).on("mouseover mouseout click", function (e) {
        var elem = e.target, type = e.type;
        if (elem === this) {
            elem = $(elem);
            if (type === "mouseover") {
                elem.addClass("hover");
            } else if (type === "mouseout") {
                elem.removeClass("hover");
            } else if (type === "click") {
                elem.hide();
            }
        }
    });
    return {
        hide: hideOverlay,
        show: showOverlay
    };
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
//       base   : "http://zrajm.github.io/teckentranskription/lexicon.html",
//       overlay: "",
//       query  : "buss,taxi",
//       video  : true,
//   };
//
var urlFragment = (function () {
    "use strict";
    var state = { overlay: "", query: undefined, video: true };
    function getStateFromUrl() {
        var x = window.location.href
            .match(/^([^#]*)(?:(#*)([^#\/]*)(?:\/([^#\/]*))?)/u).slice(1);
        return {
            base   : x[0],
            overlay: decodeURIComponent(x[3] || ""),
            query  : decodeURIComponent(x[2]),
            video  : (!x[1] || x[1] === "#" ? true : false)
        };
    }
    function setUrlFromState(state) {
        var str = encodeURIComponent(state.query) +
            (state.overlay ? ("/" + encodeURIComponent(state.overlay)) : "");
        if (str || state.video !== undefined) {
            str = (state.video ? "#" : "##") + str;
        }
        return state.base + str;
    }
    function getHashFromStr(hashStr) {
        var x = hashStr.split("/");
        var queryStr = x[0] || state.query;
        var overlayStr = x[1];
        return (state.video ? "#" : "##") +
            encodeURIComponent(queryStr) +
            (overlayStr ? ("/" + encodeURIComponent(overlayStr)) : "");
    }
    // .set({ query: STR, video: BOOL, overlay: STR })
    // Update internal state + URL, without triggering hashchange event.
    function setState(partial) {
        var modified = false;
        ["overlay", "query", "video"].forEach(function (n) {
            if (partial[n] !== state[n] && partial[n] !== undefined) {
                state[n] = partial[n];
                modified = true;
            }
        });
        if (modified) {                         // update URL
            window.history.pushState({}, "", setUrlFromState(state));
            return true;
        }
        return false;
    }

    var hooks = {};
    function onOverlayChange(callback) { hooks.overlay = callback; }
    function onQueryChange(callback)   { hooks.query = callback; }
    function onVideoToggle(callback)   { hooks.video = callback; }
    $(window).on("hashchange", function () {
        var newState = getStateFromUrl();
        var run = [];
        ["base", "overlay", "query", "video"].forEach(function (n) {
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
    $(function () { $(window).trigger("hashchange"); });

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
    "use strict";
    var timeFirst;
    var timeLast;
    function reset() {
        timeFirst = perf.now();
        timeLast = timeFirst;
    }
    function prefix(ms) {
        var str = ms > 1000
            ? (ms / 1000 + 0.5) + "s"  // seconds
            : (ms + 0.5) + "ms";       // milliseconds
        return str.replace(/^([.0-9]{0,3}[0-9]?)[.0-9]*([a-z]+)/, "$1$2");
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
// Scroll-to-top button module -- Display button for scrolling back to top of
// page when user scrolls down more than 100px.
//
(function (w) {
    "use strict";
    var oldTop = 0;
    var jqContainer = $(
        "<img src='pic/gui/up-arrow.svg' title='Scroll to top'>"
    ).prependTo(document.body).hide().css({
        background: "#fff",
        position: "fixed",
        right: ".9em",
        bottom: ".6em",
        zIndex: 4000,
        borderRadius: "50%",
        height: "1.5em",
        boxShadow: "0 16px 24px 2px rgba(0,0,0,.14)," +
                "0 6px 30px 5px rgba(0,0,0,.12)," +
                "0 8px 10px -5px rgba(0,0,0,.4)",
        padding: ".3em"
    }).click(function () {
        $("body, html").animate({scrollTop: 0}, 500);
    });
    w.scroll(function () {
        var curTop = w.scrollTop() <= 100;
        if (curTop !== oldTop) {
            jqContainer[curTop
                ? "fadeOut"
                : "fadeIn"]();
            oldTop = curTop;
        }
    });
}($(window)));

////////////////////////////////////////////////////////////////////////////////
//
// Functions
//

// Split user-provided query string into a query object, with the following
// syntax:
//
// query = [
//   [                         // subquery (array with 2 elements)
//      [ /re1/g, /re2/g ],    //   1 element: array of search terms
//      [ /re3/g, /re4/g ],    //   2 element: array of negated terms
//   ], ...                    // moar subqueries...
// ]
//
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
function parseQuery(queryStr) {
    "use strict";

    // Escape all regular expression metacharacters & the regex delimiter '/'.
    function quotemeta(str) {
        // PCRE/ERE:          *+? ^$. [  { ()|   \
        // MSIE meta + delim: *+? ^$. [ ]{}()| / \
        return str.replace(/^[*+?\^$.\[\]{}()|\/\\]$/u, "\\$&");
    }
    // Split string into list of Unicode characters.
    function splitIntoChars(str) {
        return str.split(/(?!$)/mu);
    }

    var queryBuilder = (function () {
        var query = [];
        var negative;

        function str2regex(regex) {
            // Does lookbehind (?<=..) doesn't work in Edge or Firefox!
            //return new RegExp("(?:^|(?<=\s))" + x + "(?=$|\s)", "gui");
            return new RegExp(regex, "gui");
        }
        function addSubquery() {
            query.push({
                include: [],
                exclude: []
            });
            negative = false;
        }
        var nonWord = "[ 􌥠,:!?/.’()[\\]&+–]"; // (FIXME: Removed: '-')
        var leadingNonAlpha  = new RegExp("^" + nonWord, "ui");
        var trailingNonAlpha = new RegExp(nonWord + "$", "ui");
        function addTerm (term, plainTerm, type) {
            if (term !== "") {
                term = type === "field"
                    ? "^" + term + "$"          // entire field
                    : (plainTerm.match(leadingNonAlpha)  ? "" : "(?:" + nonWord + "|^)") +
                      term +
                      (plainTerm.match(trailingNonAlpha) ? "" : "(?=" + nonWord + "|$)");
                query[query.length - 1][
                    negative
                        ? "exclude"
                        : "include"
                ].push(term);
                negative = false;
            }
        }

        addSubquery();
        return {
            addSubquery: addSubquery,
            addTerm: addTerm,
            getQuery: function getQuery() {
                // Ignore subqueries without positive search terms, turn all
                // values to regexes, and add a hilite regex to each subquery.
                return query.reduce(function (acc, subquery) {
                    return (subquery.include.length + subquery.exclude.length) === 0
                        ? acc                   // remove empty subquery
                        : acc.concat({          // add non-empty subquery
                            hilite: str2regex(subquery.include.join("|")),
                            include: (
                                // If all terms are negated, add implicit '*'.
                                subquery.include.length === 0 ? [""] : subquery.include
                            ).map(str2regex),
                            exclude: subquery.exclude.map(str2regex)
                        });
                }, []);
            },
            negative: function () {
                negative = true;
            }
        };
    }());
    var metachars = {
        "a": "[aàáâã]",
        "c": "[cç]",
        "e": "[eèéêë]",
        "i": "[iìíîï]",
        "n": "[nñ]",
        "o": "[oòóôõ]",
        "u": "[uùúûü]",
        "y": "[yýü]",
        "ä": "[äæ]",
        "ö": "[öø]",
        "􌤆": "[􌤆􌤂􌥞􌤀􌤃􌤄􌤅􌤾􌤈􌤇􌤉􌤋􌤊􌤼􌤌􌤛][􌤺􌥛􌤻􌤹􌥚]?", // face
        "􌤂": "[􌤂􌤀􌤃􌤄􌤅􌤾􌤈􌤇􌤉􌤋􌤊􌤼][􌤺􌥛􌤻􌤹􌥚]?",     // upper face
        "􌥞": "[􌥞􌤾􌤈􌤇􌤉􌤋􌤊􌤼􌤌􌤛][􌤺􌥛􌤻􌤹􌥚]?",       // lower face
        "􌥜": "[􌥜􌤑􌦲􌤒][􌤺􌥛􌤻􌤹􌥚]?",             // arm
        "􌤠": "[􌤠􌥀􌤡][􌤺􌥛􌤻􌤹􌥚]?",              // shoulders
        "􌤓": "[􌤓􌤕􌤔][􌤺􌥛􌤻􌤹􌥚]?",              // chest
        "􌤗": "[􌤗􌤙􌤘][􌤺􌥛􌤻􌤹􌥚]?",              // hips
        "*": "[^ 􌥠]*",           // all non-space, non-'/' delimiter
        "@":                     // one place symbol (+ optional relation)
                "[􌦳􌤆􌤂􌥞􌤀􌤃􌤄􌤅􌤾􌤈􌤇􌤉􌤋􌤊􌤼􌤌􌤛􌤜􌤞􌤠􌥀􌤡􌥜􌤑􌦲􌤒􌤓􌤕􌤔􌤖􌤗􌤙􌤘􌤚][􌤺􌥛􌤻􌤹􌥚]?",
        "#":                     // one handshape symbol (+ optional relation)
                "[􌤤􌥄􌤣􌤧􌥋􌥉􌦫􌤩􌤎􌥇􌦬􌤦􌤲􌤱􌥑􌤢􌥂􌤪􌥎􌥈􌤨􌤿􌥌􌥆􌤫􌦭􌤬􌥅􌤥􌥊􌦱􌤽􌤯􌤭􌤮􌤰􌤳􌥃􌥒􌥟􌦪][􌤺􌥛􌤻􌤹􌥚]?",
        "^": "[􌤺􌥛􌤻􌤹􌥚]",          // one relation symbol
        ":": "[􌥓􌥔􌤴􌥕􌤵􌥖][􌤶􌥗􌤷􌥘􌤸􌥙]"  // one attitude symbol
    };
    // Unquoted place/handshape symbols should also match a following
    // (optional) relation symbol.
    splitIntoChars(
        "􌦳􌤀􌤃􌤄􌤅􌤾􌤈􌤇􌤉􌤋􌤊􌤼􌤌􌤛􌤜􌤞􌥀􌤡􌤑􌦲􌤒􌤕􌤔􌤖􌤙􌤘􌤚􌤤􌥄􌤣􌤧􌥋􌥉􌦫􌤩􌤎􌥇􌦬􌤦􌤲􌤱􌥑􌤢􌥂􌤪􌥎􌥈􌤨􌤿􌥌􌥆􌤫􌦭􌤬􌥅􌤥􌥊􌦱􌤽􌤯􌤭􌤮􌤰􌤳􌥃􌥒􌥟􌦪"
    ).forEach(function (char) {
        metachars[char] = char + "[􌤺􌥛􌤻􌤹􌥚]?";
    });

    // All unquoted hand-external motion symbols (circling/bouncing/curving/
    // hitting/twisting/divering/converging) should also match a following
    // (optional) motion direction symbol.
    splitIntoChars(
        "􌥯􌦶􌥰􌦮􌦯􌦰􌥱􌥲􌥹􌦅"
    ).forEach(function (char) {
        metachars[char] = char + "[􌦈􌥽􌦉􌥾􌦊􌦋􌥿􌦀􌦌􌦂􌦵]?";
    });

    var term = "";
    var plainTerm = "";
    var quote = "";
    var type = "word";
    splitIntoChars(queryStr).forEach(function (char) {
        if (quote !== "") {                    // quoted chars
            if (char === quote) {
                quote = "";
            } else {
                term += quotemeta(char);
                plainTerm += char;
            }
        } else {                               // unquoted chars
            switch (char) {
            case ",":                          //   subquery
                queryBuilder.addTerm(term, plainTerm, type);
                queryBuilder.addSubquery();
                type = "word";
                term = "";
                plainTerm = "";
                break;
            case " ":                          //   term
                queryBuilder.addTerm(term, plainTerm, type);
                type = "word";
                term = "";
                plainTerm = "";
                break;
            case "\"":                         //   quote
            case "'":
                quote = char;
                break;
            default:
                if (term === "") {             //   leading
                    if (char === "-") {        //     '-' (negation)
                        queryBuilder.negative();
                        break;
                    } else if (char === "=") { //     '=' (exact match)
                        type = "field";
                        break;
                    }
                }
                term += metachars[char] || quotemeta(char);
                plainTerm += char;
            }
        }
    });
    queryBuilder.addTerm(term, plainTerm, type);
    return queryBuilder.getQuery();
}

function dump(msg, object) {
    "use strict";
    if (typeof msg === "object") {             // if no msg, then use '%s'
        object = msg;
        msg = "%s";
    }
    window.console.log(msg.replace(/%s/, JSON.stringify(object, function (ignore, value) {
        return value.constructor === RegExp
            ? value.toString()
            : value;
    }, 4)));
}

// Return true if at least one element in entry matches regex. (The
// `regex.lastIndex` property is modified by this function).
function regexInEntry(regex, entry) {
    "use strict";
    // `lastIndex` is set to make sure that search start at beginning of
    // string, even when regex flag /g is used.
    regex.lastIndex = 0;
    return entry.some(function (field) {
        return regex.test(field);
    });
}

// Subquery is a two-element array. 1st element is list of regexes that must
// all be found, 2nd element is list of regexes that must NOT be found.
function subqueryInEntry(subquery, entry) {
    "use strict";
    return subquery.include.every(function (re) {// all positive terms and
        return regexInEntry(re, entry);
    }) && !subquery.exclude.some(function (re) { //   no negative terms matches
        return regexInEntry(re, entry);
    });
}

// Return matching subquery number or -1 if no subquery match. (To get
// truthiness, do binary not ['~'] on returned value.)
function queryInEntry(query, entry) {
    "use strict";
    return query.findIndex(function (subquery) {
        return subqueryInEntry(subquery, entry);
    });
}

function hilite(str, regex) {
    "use strict";
    return str.replace(regex, function (substr) {
        return "<mark>" + substr + "</mark>";
    });
}

// Turn a (hilited) transcription string into HTML.
function htmlifyTranscription(hilitedTransStr) {
    "use strict";
    return hilitedTransStr
        // Add <span class=fingerspell>...</span> around substrings of
        // printable latin-1 chars. If there are <mark>/</mark> tags inside the
        // transcript string, make sure we add the matching number of tags on
        // the relevant <span> tag (to make sure HTML remains valid).
        .replace(/[\x21-\xff]+/gu, function (spelledStr) {
            var stack = [];
            var begTag = "<span class=fingerspell>";
            var endTag = "</span>";

            // If substring is HTML only (i.e. no text): Keep it as-is.
            if (spelledStr.match(/^(<[^<>]+>)*$/)) {
                return spelledStr;
            }

            // Go through HTML tags in substring using a stack to keep track of
            // completed tags. For each end tag remove correspending start tag,
            // so that result final stack reflects all unfinished tags.
            spelledStr.replace(/<(\/?)([a-zA-Z0-9]+)>/g, function (tag, type, name) {
                if (type === "/" && stack[stack.length - 1] === name) {
                    stack.pop();
                } else {
                    stack.push(type + name);
                }
            });

            // Go through remaining stack and add corresponding tags to wrapper
            // <span>.
            stack.forEach(function (tag) {
                if (tag.match(/^\//)) {
                    begTag = "</mark>" + begTag + "<mark>";
                } else {
                    endTag = "</mark>" + endTag + "<mark>";
                }
            });
            return begTag + spelledStr + endTag;
        })
        // Insert <wbr> tag after all segment separators.
        .replace(/􌥠/gu, '􌥠<wbr>');
}

// Downcase string, remove all non-alphanumenic characters and space (by
// replacing Swedish chars with aao, and space with '-') and collapse all
// repetitions of '-'.
function unicodeTo7bit(str) {
    return str.toLowerCase().replace(/[^a-z0-9-]/gu, function (m) {
        return {
            " ": "-", "é": "e", "ü": "u", "å": "a", "ä": "a", "ö": "o", "–": "-",
        }[m] || "";
    }).replace(/-{2,}/, "-");
}

function htmlifyMatch(match) {
    "use strict";
    var hiliteRegex = match.hilite;
    var entry = match.entry;
    var id = entry[0];                         // 1st field
    var transcr = entry[1];                    // 2nd field
    var swe = entry.slice(2);                  // remaining fields
    return (
        "<div class=match>" +
            "<div class='video-container is-loading'>" +
                "<img src='{baseUrl}/photos/{dir}/{file}-{id}-tecken.jpg'" +
                " data-video='{baseUrl}/movies/{dir}/{file}-{id}-tecken.mp4'>" +
                "<div class=video-feedback></div>" +
                "<a class=video-id href='{baseUrl}/ord/{id}'" +
                " title='Visa i Svenskt tecken­språks­lexikon (ny tabb)'" +
                " target=_blank>{htmlId}</a> " +
                "<div class=video-subs>" +
                    "<a data-href='{transcr}' title='{htmlTranscr}'>" +
                        "{htmlTranscr}</a>" +
                "</div>" +
            "</div> " +
            "<span title='{htmlSwedish}'>{htmlSwedish}</span>" +
        "</div>\n"
    ).supplant({
        id: id,
        htmlId: hilite(id, hiliteRegex),
        baseUrl: "https://teckensprakslexikon.su.se",
        dir: id.substring(0, 2),
        file: unicodeTo7bit(swe[0]),
        transcr: transcr,
        htmlTranscr: htmlifyTranscription(hilite(transcr, hiliteRegex)),
        htmlSwedish: swe.map(function (txt) {
            return hilite(txt, hiliteRegex);
        }).join(", ")
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
    "use strict";
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
        return (pageOffset + winHeight >= pageHeight - 2) ? true : false
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
            statusElem.html("{0} träffar (visar alla)".supplant([count]));
        } else {
            statusElem.html(
                "{1} träffar (visar {0}) – <a>Visa {2} till</a>"
                    .supplant([count, startSize, chunksize])
            );
            $(">a",statusElem).click(function () { outputNext(); });
        }

        resultElem.append(chunk.join(""));
        resultElem.imagesLoaded().progress(onImageLoad);

        if (htmlQueue.length === 0) {          // nothing more to display
            buttonElem.hide();
            $(window).off("scroll");
        } else {                               // moar to display
            if (!hasListener) {
                buttonElem.click(function () { outputNext(); });
                hasListener = true;
            }
            if (args) {
                buttonElem.show();
                $(window).on("scroll", function () {
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
    parentElem.removeClass("is-loading");
    if (!image.isLoaded) {
        parentElem.addClass("is-broken");
    }
}

function searchLexicon(queryStr) {
    "use strict";
    $("#q").val(queryStr);
    setTimeout(function () {
        var query = parseQuery(queryStr);
        var i;
        var len;
        var subquery;
        var matches = [];

        logTiming.reset();
        if (query.length > 0) {
            len = lexicon.length;
            for (i = 0; i < len; i += 1) {
                subquery = queryInEntry(query, lexicon[i]);
                if (subquery > -1) {
                    matches.push({
                        hilite: query[subquery].hilite,
                        entry: lexicon[i]
                    });
                }
            }
        }
        logTiming.total("Search took %s.");

        // Query without matches, display search tips.
        $("#nomatch")[(query.length > 0 && matches.length === 0) ? "show" : "hide"]();

        // No query, display info text.
        $("#noquery")[query.length === 0 ? "show" : "hide"]();

        outputMatching({
            status: $("#search-count"),
            result: $("#search-result").empty(),
            button: $("#more"),
            html: matches.map(htmlifyMatch)
        });
    }, 0);
}

function onPlayPauseToggle(event) {
    "use strict";
    var feedbackElem;
    if ($(event.target).is("a")) {             // a link was clicked: abort
        return;
    }
    var jqContainer = $(event.currentTarget);
    var jqVideo = $(">video,>img[data-video]", jqContainer);

    if (jqVideo.is("img")) {                    // replace <img> with <video>
        jqVideo = $(
            "<video loop muted playsinline src='{0}' poster='{1}'></video>"
                .supplant([jqVideo.data("video"), jqVideo.attr("src")])
        ).replaceAll(jqVideo).on("canplay error", function (e) {
            jqVideo.off("canplay error");
            jqContainer.removeClass("is-loading-video is-broken");
            if (e.type === "error") {
                jqContainer.addClass("is-broken");
            }
        });
        jqContainer.addClass("is-loading-video");
    }

    // Get state of video and toggle play/pause state.
    // (Everything that remains after this is visual feedback.)
    var action = jqVideo.prop("paused") ? "play" : "pause";
    jqVideo.trigger(action);

    // Add icon to feedback overlay & animate it.
    feedbackElem = $(">.video-feedback", jqContainer)
        .removeClass("anim pause play")
        .addClass(action);                     // display play/pause icon
    setTimeout(function () {                   // animate icon
        feedbackElem
            .addClass("anim")
            .one("transitionend", function() {
                feedbackElem.removeClass("anim pause play");
            });
    }, 10);
}

$("#search-result")
    .on("click", ".video-container", onPlayPauseToggle)
    .on("dblclick", ".video-container", function (event) {
        toggleFullscreen($(">video", event.currentTarget)[0]);
    });

// Tooltips: These imitate Chromium tooltip behaviour, but allow us to use any
// font -- so that sign language transcriptions can be displayed.
(function () {
    var timeout;
    var shown = false;
    var jqTooltip = $("<div class=tooltip></div>").appendTo(document.body).css({
        display: "none", color: "#fff", background: "#555", borderRadius: 2,
        boxShadow: "0 2px 6px rgba(0, 0, 0, .25)", fontSize: 16,
        lineHeight: "1.6", padding: ".5em", position: "fixed",
        zIndex: 2147483647 /* max allowed */
    });

    // Trigger event if pointer is non-moving for half a second.
    $(document.body).on("mouseover", "[title],[data-title]", function (event) {
        var jq = $(event.target);
        var value = jq.attr("title");

        // Change attribute 'title' => 'data-title' to suppress browser tooltip.
        if (value !== undefined) {
            jq.attr("data-title", value).removeAttr("title");
        }

        clearTimeout(timeout);
        timeout = setTimeout(function () {
            if (jq.is(":hover")) {
                onMouseStill(event);
            }
        }, 500);
    });

    function onMouseStill(event) {
        var x = event.clientX + 10;
        var y = event.clientY + 10;

        // Display topleft to get height + width.
        shown = true;
        jqTooltip
            .css({ left: 0, top: 0 })
            .html($(event.target).data("title"))
            .show();

        // Now use height and width of displayed tooltip, to move it to the
        // right place (making sure it doesn't stick out of right/bottom corner
        // of window).
        var xMax = $(window).width()  - jqTooltip.outerWidth();
        var yMax = $(window).height() - jqTooltip.outerHeight();
        jqTooltip.css({
            left: x < xMax ? x : (xMax < 0 ? 0 : xMax),
            top:  y < yMax ? y : (yMax < 0 ? 0 : yMax),
        });
    }

    function hideTooltip() {
        if (shown) {
            shown = false
            jqTooltip.hide();
        }
    }
    $(window).on("hashchange resize", hideTooltip);
    $(document).on("scroll mousemove mousedown keydown", hideTooltip);
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

// When search form input changes.
(function () {
    "use strict";
    var jqElem = $("#q");
    jqElem.change(function () {
        var queryStr = jqElem.val() || "";
        urlFragment.set({ query: queryStr }) && searchLexicon(queryStr);
    });
}());

// Update lexicon date in page footer.
(function () {
    "use strict";
    function updateLexiconDate() {
        if (lexiconDate === undefined) {
            setTimeout(updateLexiconDate, 250);
        } else {
            $("#lexicon-date").html(lexiconDate.toLocaleString(
                "sv", { year: "numeric", month: "long", day: "numeric" }
            ));
            $("#lexicon-size").html(
                (Object.keys(lexicon).length + "")
                    .replace(/(?=([0-9]{3})+$)/g, " ")
            );
        }
    }
    $(updateLexiconDate);
}());

function showVideos (bool) {
    var hasVideo = $("#search-wrapper")
        .removeClass("video-view text-view")
        .addClass(bool ? "video-view" : "text-view");
}
$("#search-wrapper .selector").on("click keypress", function(e) {
    if (e.type === "keypress") {
        if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) { return; }
        if (e.which !== 13 && e.which !== 32) { return; }
    }
    var hasVideo = $("#search-wrapper")
        .toggleClass("video-view text-view")
        .hasClass("video-view");
    urlFragment.set({ video: hasVideo });
});

// Update 'href' attr when mouse enters <a data-href=…> tag (used to retain
// current video/text result setting). 'data-href' syntax: [query][/overlay]
$(function () {
    // 'mouseenter' used here since it does not trigger when child elements are
    // entered, and the event does not bubble.
    $("#search-result").on("mouseenter", "a[data-href]", function (e) {
        var jq = $(e.currentTarget);
        var hashref = jq.data("href") || "";
        if (hashref) {
            jq.attr("href", urlFragment.getHash(hashref));
        }
    });
});

//[eof]
