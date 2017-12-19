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
    var findStr = $(this).val() || ''
    do_search(findStr)
});

function do_search(findStr) {
    urlFragment.set(findStr)
    $('#q').val(findStr)
    if (findStr) {
        lowerStr = findStr.toLowerCase()
        output_matching(search_lexicon(lowerStr), lowerStr)
    }
}

function matching_entry(findStr, entry) {
    return entry.slice(1).some(function(fieldStr) {
        return fieldStr.indexOf(findStr) >= 0 ? true : false;
        //if (fieldStr.indexOf(findStr) >= 0) {
        //    return true;
        //}
        //return false;
    });
}

function hilite(str, needle) {
    return str.replace(needle, function (substr) {
        return '<mark>' + substr + '</mark>'
    })
}

function htmlifyEntry(entry, hiliteText) {
    var //image = entry[0],
        id    = entry[1],
        trans = entry[2],
        swe   = entry.slice(3)
    return [
        //'image: ' + image + '\n',
        '<span class=gray>' + hilite(id, hiliteText) + '</span> ' +
        hilite(trans, hiliteText) + ' ' +
        '<a href="http://teckensprakslexikon.su.se/ord/' + id + '" target=_blank>' +
            swe.map(function(txt) {
                return hilite(txt, hiliteText)
            }).join(', ') + '</a>',
    ]
}

function output_matching(matchingTxt, hiliteText) {
    var html =
        'Sökträffar: ' + matchingTxt.length + '\n' +
        matchingTxt.map(function(entry) {
            return '<br>' + htmlifyEntry(entry, hiliteText).join(' ')
        }).join('')
    $('.results').html(html)
}

function search_lexicon(findStr) {
    var matchingTxt = [];
    lexicon.forEach(function(entry) {
        if (matching_entry(findStr, entry)) {
            matchingTxt.push(entry);
        }
    });
    return matchingTxt
}
//[eof]
