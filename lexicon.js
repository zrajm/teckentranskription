////////////////////////////////////////////////////////////////////////////////
//
// UrlFragment module.
//
var urlFragment = (function () {
    // Base URL (w/o hash fragment).
    function getBaseUrl() { return window.location.href.split('#')[0] }

    // URL fragment (w/o leading '#')
    function getFragment() { return decodeURI(window.location.hash.substr(1)) }

    // Set hashchange function callback.
    function onChange(func) {
        $(window).on('hashchange', function () { func(getFragment()) })
    }

    // Change URL fragment (does not trigger hashchange event).
    function setFragment(urlFragment) {
        var url = getBaseUrl() + '#' + encodeURI(urlFragment)
        if (getFragment() !== urlFragment) {
            window.history.pushState({}, '', url)
        }
    }

    // Trigger hashchange on pageload.
    $(function () { $(window).trigger('hashchange') })

    return { set: setFragment, onChange: onChange };
}())

////////////////////////////////////////////////////////////////////////////////

urlFragment.onChange(do_search)  // URL fragment change
$('#q').change(function () {     // form input change
    var searchQuery = $(this).val() || ''
    do_search(searchQuery)
});

function do_search(searchQuery) {
    var regex = new RegExp(searchQuery.replace(/[^a-z]/gi, '\\$&'), 'i')
    urlFragment.set(searchQuery)
    $('#q').val(searchQuery)
    if (searchQuery) {
        output_matching(search_lexicon(regex), regex)
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

var timer = (function() {
    var timeFirst, timeLast
    function reset() {
        timeFirst = performance.now()
        timeLast  = timeFirst
    }
    function prefix(ms) {
        return (
            ms > 1000 ?
                (ms / 1000 + .5) + 's'  :
                (ms        + .5) + 'ms'
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
        total: total,
        step: step,
        reset: reset,
    }
}())


var progressBar = (function() {
    $('body').prepend('<div id=progress><div></div></div>')
    $('#progress').css({
        position: 'fixed',
        boxShadow: 'inset 0 -4px 2px #eee',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
    }).hide()
    var domProgress = $('#progress div').css({
        opacity: .75,
        height: 3,
        background: '#900',
        width: 0,
    })
    function progressBar(percent) {
        $('#progress')[percent === undefined ? 'hide' : 'show']()
        domProgress.css({ width: percent + '%' })
    }
    return progressBar
}())

function output_matching_by_chunk(elem, htmlQueue, startSize) {
    var chunksize = 500, chunk, percent
    if (!startSize) {
        startSize = htmlQueue.length
        timer.reset()
    }
    // Output one chunk of search result (in own <div> for speed).
    chunk = htmlQueue.splice(0, chunksize)
    elem.append('<div>' + chunk.join('') + '</div>')

    // Update progress bar & debug output to console.
    percent = 100 - Math.round((htmlQueue.length / (startSize || 1)) * 100)
    progressBar(percent)
    timer.step('  ' + percent + '% – Showing chunk took %s.')

    // Process next chunk (using recursion).
    if (htmlQueue.length > 0) {            // if moar chunks remain
        setTimeout(function () {           //   process them
            output_matching_by_chunk(elem, htmlQueue, startSize)
        }, 0)
    } else {                               // if all chunks done
        timer.total('Showing ' + startSize + ' results took %s.')
        setTimeout(function () {           //   hide progress bar
            progressBar(undefined)
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
    timer.reset()
    lexicon.forEach(function(entry) {
        if (matching_entry(regex, entry)) {
            matchingTxt.push(entry);
        }
    });
    timer.total('Search took %s.')
    return matchingTxt
}
//[eof]
