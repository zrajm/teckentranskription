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
    urlFragment.set(searchQuery)
    $('#q').val(searchQuery)
    if (searchQuery) {
        setTimeout(function () {
            var regex = new RegExp(searchQuery.replace(/[^a-z]/gi, '\\$&'), 'i')
            output_matching(search_lexicon(regex), regex)
        }, 0)
    }
}

function matching_entry(regex, entry) {
    return entry.slice(1).some(function(fieldStr) {
        return fieldStr.match(regex)
    });
}

function hilite(str, regex) {
    return str.replace(regex, function (substr) {
        return '<mark>' + substr + '</mark>'
    })
}

function htmlifyEntry(entry, hiliteRegex) {
    var //image = entry[0],
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

function output_matching(matchingTxt, hiliteRegex) {
    var elem = $('#results').html('<div class=gray>Visar ' + matchingTxt.length + ' träffar…</div>'),
        htmlQueue = matchingTxt.map(function(entry) {
            return '<div>' + htmlifyEntry(entry, hiliteRegex).join(' ') + '</div>\n'
        })
    output_matching_by_chunk(elem, htmlQueue)
}

function search_lexicon(regex) {
    var matchingTxt = [];
    logTiming.reset()
    lexicon.forEach(function(entry) {
        if (matching_entry(regex, entry)) {
            matchingTxt.push(entry);
        }
    });
    logTiming.total('Search took %s.')
    return matchingTxt
}

//[eof]
