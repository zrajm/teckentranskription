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

function output_matching(matchingTxt, hiliteRegex) {
    var html =
        '<div class=gray>' + matchingTxt.length + ' sökträffar</div>\n' +
        matchingTxt.map(function(entry) {
            return '<div>' + htmlifyEntry(entry, hiliteRegex).join(' ') + '</div>'
        }).join('')
    $('#results').html('<div class=gray>Visar ' + matchingTxt.length + ' träffar…</div>')
    setTimeout(function () {
        timer.reset()
        $('#results').html(html)
        setTimeout(function () {
            timer.total('Showing ' + matchingTxt.length + ' results took %s.')
        }, 0)
    }, 0)
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
