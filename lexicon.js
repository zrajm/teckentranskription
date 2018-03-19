/*jslint browser fudge */
/*global window $ lexicon */

////////////////////////////////////////////////////////////////////////////////
//
// URL fragment module -- Update/trigger on URL fragment change.
//
//   .set(STR) -- set URL fragment to '#STR' w/o triggering `onchange()`
//   .onChange(FUNC) -- Call FUNC(STR) on fragment change
//
var urlFragment = (function () {
    "use strict";
    // Base URL (w/o hash fragment).
    function getBaseUrl() {
        return window.location.href.split("#")[0];
    }
    // URL fragment (no leading '#')
    function getFragment() {
        return decodeURIComponent(window.location.hash.substr(1));
    }
    // Change URL fragment (does not trigger hashchange event).
    function setFragment(urlFragment) {
        var url = getBaseUrl() + "#" + encodeURIComponent(urlFragment);
        if (getFragment() !== urlFragment) {
            window.history.pushState({}, "", url);
        }
    }
    // Set hashchange function callback.
    function onChange(func) {
        $(window).on("hashchange", function () {
            func(getFragment());
        });
    }
    // Trigger hashchange on pageload.
    $(function () {
        $(window).trigger("hashchange");
    });
    return {
        set: setFragment,
        onChange: onChange
    };
}());

////////////////////////////////////////////////////////////////////////////////
//
// Progress bar module -- Display thin progress bar line at the top of the
// window.
//
//   progressBar(PERCENT) -- show progress bar, and set to PERCENT
//   progressBar() -- hide progress bar
//
var progressBar = (function () {
    "use strict";
    var jqContainer = $("<div><div></div></div>").prependTo(document.body).css({
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        boxShadow: "inset 0 -4px 2px #eee"
    }).hide();
    var jqContent = jqContainer.children().css({
        width: 0,
        height: 3,
        opacity: 0.75,
        background: "#900"
    });
    return function (percent) {
        jqContainer[percent === undefined
            ? "hide"
            : "show"]();
        jqContent.css({
            width: percent + "%"
        });
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
        "<img src=\"pic/gui/up-arrow.svg\" title=\"Scroll to top\">"
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
            // Does lookbehind (?<=..) work on MSIE?
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

        addSubquery();
        return {
            addSubquery: addSubquery,
            addTerm: function (term) {
                if (term !== "") {
                    query[query.length - 1][
                        negative
                            ? "exclude"
                            : "include"
                    ].push(term);
                    negative = false;
                }
            },
            getQuery: function getQuery() {
                // Ignore subqueries without positive search terms, turn all
                // values to regexes, and add a hilite regex to each subquery.
                return query.reduce(function (query, subquery) {
                    return subquery.include.length === 0
                        ? query
                        : query.concat({
                            hilite: str2regex(subquery.include.join("|")),
                            include: subquery.include.map(str2regex),
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
        "􌦳􌤆􌤂􌥞􌤀􌤃􌤄􌤅􌤾􌤈􌤇􌤉􌤋􌤊􌤼􌤌􌤛􌤜􌤞􌤠􌥀􌤡􌥜􌤑􌦲􌤒􌤓􌤕􌤔􌤖􌤗􌤙􌤘􌤚􌤤􌥄􌤣􌤧􌥋􌥉􌦫􌤩􌤎􌥇􌦬􌤦􌤲􌤱􌥑􌤢􌥂􌤪􌥎􌥈􌤨􌤿􌥌􌥆􌤫􌦭􌤬􌥅􌤥􌥊􌦱􌤽􌤯􌤭􌤮􌤰􌤳􌥃􌥒􌥟􌦪"
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
    var quote = "";
    splitIntoChars(queryStr).forEach(function (char) {
        if (quote) {                           // quoted chars
            switch (char) {
            case quote:
                quote = "";
                break;
            default:
                term += quotemeta(char);
            }
        } else {                               // unquoted chars
            switch (char) {
            case ",":                          //   subquery
                queryBuilder.addTerm(term);
                queryBuilder.addSubquery();
                term = "";
                break;
            case " ":                          //   term
                queryBuilder.addTerm(term);
                term = "";
                break;
            case "\"":                         //   quote
            case "'":
                quote = char;
                break;
            default:
                if (char === "-" && !term) {   //   leading '-' (negation)
                    queryBuilder.negative();
                } else {
                    term += metachars[char] || quotemeta(char);
                }
            }
        }
    });
    queryBuilder.addTerm(term);
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

function htmlifyEntry(match) {
    "use strict";
    var hiliteRegex = match.hilite;
    var entry = match.entry;
    var id = entry[0];                         // 1st field
    var trans = entry[1];                      // 2nd field
    var swe = entry.slice(2);                  // remaining fields
    return [
        "<a href=\"http://teckensprakslexikon.su.se/ord/" + id + "\" target=_blank>" +
                hilite(id, hiliteRegex) + "</a>",
        hilite(trans, hiliteRegex),
        swe.map(function (txt) {
            return hilite(txt, hiliteRegex);
        }).join(", ")
    ].join(" ");
}

function outputMatching(elem, htmlQueue, startSize) {
    "use strict";
    var chunksize = 500;
    var chunk;
    var percent;
    if (!startSize) {
        startSize = htmlQueue.length;
        logTiming.reset();
    }
    // Output one chunk of search result (in own <div> for speed).
    chunk = htmlQueue.splice(0, chunksize);
    elem.append("<div>" + chunk.join("") + "</div>");

    // Update progress bar & debug output to console.
    percent = 100 - Math.round((htmlQueue.length / (startSize || 1)) * 100);
    progressBar(percent);
    logTiming.step("  " + percent + "% – Showing chunk took %s.");

    // Process next chunk (using recursion).
    if (htmlQueue.length > 0) {            // if moar chunks remain
        setTimeout(function () {           //   process them
            outputMatching(elem, htmlQueue, startSize);
        }, 0);
    } else {                               // if all chunks done
        logTiming.total("Showing " + startSize + " results took %s.");
        setTimeout(function () {           //   hide progress bar
            progressBar();
        }, 250);
    }
}

function searchLexicon(queryStr) {
    "use strict";
    $("#q").val(queryStr);
    setTimeout(function () {
        var query = parseQuery(queryStr);
        urlFragment.set(queryStr);

        logTiming.reset();
        var matches = query.length === 0
            ? []
            : lexicon.reduce(function (matches, entry) {
                var subquery = queryInEntry(query, entry);
                return subquery === -1
                    ? matches
                    : matches.concat({
                        hilite: query[subquery].hilite,
                        entry: entry
                    });
            }, []);
        logTiming.total("Search took %s.");

        outputMatching(
            $("#results")
                .html("<div class=gray>Visar " + matches.length + " träffar…</div>"),
            matches.map(function (entry) {
                return "<div>" + htmlifyEntry(entry) + "</div>\n";
            })
        );
    }, 0);
}

////////////////////////////////////////////////////////////////////////////////
//
// Main program
//
urlFragment.onChange(searchLexicon); // URL fragment change

(function (selector) {
    "use strict";
    var jqElem = $(selector);
    var oldValue = jqElem.val();
    jqElem.change(function () {      // form input change
        var queryStr = jqElem.val() || "";
        if (queryStr !== oldValue) {
            oldValue = queryStr;
            searchLexicon(queryStr);
        }
    });
}("#q"));

//[eof]
