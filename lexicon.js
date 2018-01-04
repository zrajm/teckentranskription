////////////////////////////////////////////////////////////////////////////////
//
// URL fragment module -- Update/trigger on URL fragment change.
//
//   .set(STR) -- set URL fragment to '#STR' w/o triggering `onchange()`
//   .onChange(FUNC) -- Call FUNC(STR) on fragment change
//
var urlFragment = (function () {
    // Base URL (w/o hash fragment).
    function getBaseUrl() { return window.location.href.split('#')[0] }
    // URL fragment (no leading '#')
    function getFragment() { return decodeURI(window.location.hash.substr(1)) }
    // Change URL fragment (does not trigger hashchange event).
    function setFragment(urlFragment) {
        var url = getBaseUrl() + '#' + encodeURI(urlFragment)
        if (getFragment() !== urlFragment) {
            window.history.pushState({}, '', url)
        }
    }
    // Set hashchange function callback.
    function onChange(func) {
        $(window).on('hashchange', function () { func(getFragment()) })
    }
    // Trigger hashchange on pageload.
    $(function () { $(window).trigger('hashchange') })
    return {
        set: setFragment,
        onChange: onChange,
    };
}())

////////////////////////////////////////////////////////////////////////////////
//
// Progress bar module -- Display thin progress bar line at the top of the
// window.
//
//   progressBar(PERCENT) -- show progress bar, and set to PERCENT
//   progressBar() -- hide progress bar
//
var progressBar = (function() {
    var jqContainer = $('<div><div></div></div>').
        prependTo(document.body).css({
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            boxShadow: 'inset 0 -4px 2px #eee',
        }).hide(),
        jqContent = jqContainer.children().css({
            width: 0,
            height: 3,
            opacity: .75,
            background: '#900',
        })
    return function (percent) {
        jqContainer[percent === undefined ? 'hide' : 'show']()
        jqContent.css({ width: percent + '%' })
    }
}())

////////////////////////////////////////////////////////////////////////////////
//
// Timer logging module -- Output msg on console, replacing '%s' in msg with
// time in seconds or milliseconds (rounded to 3-4 digits).
//
//   .reset() -- reset time
//   .step(MSG) -- display MSG, replace %s with time since last msg
//   .total(MSG) -- display MSG, replace %s with time since last reset
//
var logTiming = (function() {
    var timeFirst, timeLast
    function reset() {
        timeFirst = performance.now()
        timeLast  = timeFirst
    }
    function prefix(ms) {
        return (
            ms > 1000 ?
                (ms / 1000 + .5) + 's'  :  // seconds
                (ms        + .5) + 'ms'    // milliseconds
        ).replace(/^([.0-9]{0,3}[0-9]?)[.0-9]*([a-z]+)/, '$1$2');
    }
    function timeSince(time) { return prefix(performance.now() - time) }
    function total(msg) {
        console.log(msg.replace(/%s/, timeSince(timeFirst)))
    }
    function step(msg) {
        console.log(msg.replace(/%s/, timeSince(timeLast)))
        timeLast = performance.now()
    }
    reset()
    return {
        reset: reset,  // reset timer
        step: step,    // output time since last msg
        total: total,  // output time since reset
    }
}());

////////////////////////////////////////////////////////////////////////////////
//
// Scroll-to-top button module -- Display button for scrolling back to top of
// page when user scrolls down more than 100px.
//
(function (w) {
    var oldTop,
        jqContainer = $('<img src="pic/gui/up-arrow.svg" title="Scroll to top">').
        prependTo(document.body).hide().css({
            background: '#fff',
            position: 'fixed',
            right: '.9em',
            bottom: '.6em',
            zIndex: 4000,
            borderRadius: '50%',
            height: '1.5em',
            boxShadow: '0 16px 24px 2px rgba(0,0,0,.14),' +
                '0 6px 30px 5px rgba(0,0,0,.12),' +
                '0 8px 10px -5px rgba(0,0,0,.4)',
            padding: '.3em',
        }).click(function () { $('body, html').animate({ scrollTop: 0 }, 500) })
    w.scroll(function() {
        var curTop = w.scrollTop() <= 100
        if (curTop !== oldTop) {
            if ( curTop) { jqContainer.fadeOut() }
            if (!curTop) { jqContainer.fadeIn() }
            scrollScroll = curTop
        }
    });
}($(window)))

////////////////////////////////////////////////////////////////////////////////
//
// Main program
//
urlFragment.onChange(do_search)  // URL fragment change
$('#q').change(function () {     // form input change
    var searchQuery = $(this).val() || ''
    do_search(searchQuery)
});

function do_search(searchQuery) {
    $('#q').val(searchQuery)
    setTimeout(function () {
        var query = parseQuery(searchQuery)
        urlFragment.set(searchQuery)
        if (query.length > 0) {
            logTiming.reset()
            var matches = search_lexicon(query)
            logTiming.total('Search took %s.')

            output_matching(matches)
        }
    }, 0)
}

// Remove matching quotes + escape regex meta characters. (Quote may also be
// missing at end of word.)
function unquote(str) {
    return str.
        replace(/^(["'])(.*?)\1?$/u, '$2').        // remove quotes
        // MSIE:   *+?^$.[ ]{}()| / \              //   metachar + regex delim
        replace(/^[*+?^$.[\]{}()|\/\\]$/u, '\\$&') // escape metachars
}

// Convert string to regex string.
function regexify(string) {
    return string.replace(/[\x00-\x7f]/gu, function (str) {
        // Invoked once for every character in the ASCII (0-127) range.
        if (str.match(/^[a-zA-Z0-9_]$/u)) { return str } // retain word chars
        switch (str) {                       // special characters
        case '*': return '[^ ]*'             //   match all non-space
        case '@': return '[􌤆􌤂􌥞􌤀􌤃􌤄􌤅􌤾􌤈􌤇􌤉􌤋􌤊􌤼􌤌􌤛􌤜􌤞􌤠􌥀􌤡􌥜􌤑􌤒􌤓􌤕􌤔􌤖􌤗􌤙􌤘􌤚][􌤺􌥛􌤻􌤹􌥚]?' // one place symbol
        case '#': return '[􌤤􌥄􌤣􌤧􌥋􌥉􌦫􌤩􌤎􌥇􌦬􌤦􌤲􌤱􌥑􌤢􌥂􌤪􌥎􌥈􌤨􌤿􌥌􌥆􌤫􌦭􌤬􌥅􌤥􌥊􌤽􌤯􌤭􌤮􌤰􌤳􌥃􌥒􌥟􌦪][􌤺􌥛􌤻􌤹􌥚]?' // one handshape symbol
        case '^': return '[􌤺􌥛􌤻􌤹􌥚]'           //   one relation symbol
        case ':': return '[􌥓􌥔􌤴􌥕􌤵􌥖][􌤶􌥗􌤷􌥘􌤸􌥙]'  //   one attitude symbol
        }
        return '\\' + str                    // backslash everything else
    })
}

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
    var m, terms, pre, neg, str, query = [], len = queryStr.length,
        termRegex = /([\s,]*)(-?)('[^']*'|"[^"]*"|[^\s,'"]*)/gyu
    while (m = termRegex.exec(',' + queryStr)) {
        pre =  m[1]                         // space/comma before TERM
        idx =  m[2] ? 'exclude' : 'include' // '-' before TERM
        str =  m[3]                         // TERM

        // Strip quotes or regexify.
        str = /^["']/.test(str) ? unquote(str) : regexify(str)

        // Preceded by comma = start new subquery.
        if (/,/.test(pre)) {
            query.push({ include: [], exclude: [], hilite: undefined })
        }

        if (pre) {                             // space before = new TERM
            terms = query[query.length - 1][idx]
            terms.push(str)
        } else {                               // otherwise TERM cont'd
            terms[terms.length - 1] += str
        }
        if (termRegex.lastIndex > len) { break }
    }
    return query.
        map(function (subquery) {    // remove empty terms
            return {
                include: subquery.include.filter(function (x) { return x !== '' }),
                exclude: subquery.exclude.filter(function (x) { return x !== '' }),
            }
        }).
        filter(function (subquery) {  // remove subqueries with no
            return subquery.include.length > 0 //   positive terms
        }).
        map(function (subquery) {              // add hilite regex to subqueries
            return {
                hilite: str2regex(subquery.include.join('|')),
                include: subquery.include.map(str2regex),
                exclude: subquery.exclude.map(str2regex),
            }
        })
}

function str2regex(x) {
    // Does lookbehind (?<=..) work on MSIE?
    //return new RegExp('(?:^|(?<=\s))' + x + '(?=$|\s)', 'gui')
    return new RegExp(x, 'gui')
}

function stripEmptyQueryTerms(x) {
    if (x instanceof Array) {
        return x.filter(function (x) { // strip empty terms
            return x !== ''
        }).map(stripEmptyQueryTerms)   // call recursivelly on all values
    }
    return x
}

function dump(object, msg) {
    RegExp.prototype.toJSON = RegExp.prototype.toString;
    console.log((msg || '%s').replace(/%s/, JSON.stringify(object, null, 4)))
}

// Return true if at least one element in entry matches regex.
function regexInEntry(regex, entry) {
    var i, l = entry.length
    // Skip first field (i = 1) in entry.
    for (i = 1; i < l; i += 1) {
        if (regex.test(entry[i])) { return true }
    }
    return false;
}

// Subquery is a two-element array. 1st element is list of regexes that must
// all be found, 2nd element is list of regexes that must NOT be found.
function subqueryInEntry(subquery, entry) {
    var positive = subquery.include, negative = subquery.exclude
    if (!positive.every(function (re) { return regexInEntry(re, entry) })) {
        return false  // not all positive terms matched
    }
    if (negative.some(function (re) { return regexInEntry(re, entry) })) {
        return false  // at least one negative term matched
    }
    return true
}

// Return matching subquery number or -1 if no subquery match. (To get
// truthiness, do binary not ['~'] on returned value.)
function queryInEntry(query, entry) {
    var i, l = query.length
    for (i = 0; i < l; i += 1) { // return 1st matching subquery number
        if (subqueryInEntry(query[i], entry)) { return i }
    }
    return -1
}

function hilite(str, regex) {
    return str.replace(regex, function (substr) {
        return '<mark>' + substr + '</mark>'
    })
}

function htmlifyEntry(match) {
    var hiliteRegex = match.hilite,
        entry       = match.entry,
        //image = entry[0],
        id    = entry[1],
        trans = entry[2],
        swe   = entry.slice(3)
    return [
        //'image: ' + image + '\n',
        '<span class=gray>' + hilite(id, hiliteRegex) + '</span> ' +
        hilite(trans, hiliteRegex) + ' ' +
        '<a href="http://teckensprakslexikon.su.se/ord/' + id + '" target=_blank>' +
            swe.map(function(txt) {
                return hilite(txt, hiliteRegex)
            }).join(', ') + '</a>',
    ]
}

function output_matching_by_chunk(elem, htmlQueue, startSize) {
    var chunksize = 500, chunk, percent
    if (!startSize) {
        startSize = htmlQueue.length
        logTiming.reset()
    }
    // Output one chunk of search result (in own <div> for speed).
    chunk = htmlQueue.splice(0, chunksize)
    elem.append('<div>' + chunk.join('') + '</div>')

    // Update progress bar & debug output to console.
    percent = 100 - Math.round((htmlQueue.length / (startSize || 1)) * 100)
    progressBar(percent)
    logTiming.step('  ' + percent + '% – Showing chunk took %s.')

    // Process next chunk (using recursion).
    if (htmlQueue.length > 0) {            // if moar chunks remain
        setTimeout(function () {           //   process them
            output_matching_by_chunk(elem, htmlQueue, startSize)
        }, 0)
    } else {                               // if all chunks done
        logTiming.total('Showing ' + startSize + ' results took %s.')
        setTimeout(function () {           //   hide progress bar
            progressBar()
        }, 250)
    }
}

function output_matching(matchingTxt) {
    var elem = $('#results').html('<div class=gray>Visar ' + matchingTxt.length + ' träffar…</div>'),
        htmlQueue = matchingTxt.map(function(entry) {
            return '<div>' + htmlifyEntry(entry).join(' ') + '</div>\n'
        })
    output_matching_by_chunk(elem, htmlQueue)
}

function search_lexicon(query) {
    var matchingTxt = [];
    lexicon.forEach(function(entry) {
        var subquery = queryInEntry(query, entry)
        if (subquery > -1) {
            matchingTxt.push({
                hilite: query[subquery].hilite,
                entry: entry,
            })
        }
    });
    return matchingTxt
}

//[eof]
