
$('input').change(function () {
    var findStr = ($(this).val() || '').toLowerCase()
    output_matching(search_lexicon(findStr), findStr)
});

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
        '<a href="http://teckensprakslexikon.su.se/ord/' + id + '" target=_blank>' +
            swe.map(function(txt) {
                return hilite(txt, hiliteText)
            }).join(', ') + '</a>',
        hilite(trans, hiliteText),
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
