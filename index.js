
// For inserting text in a textarea
function insertAtCursor(domElement, str) {
    if (document.selection) {
        // IE support
        domElement.focus();
        sel = document.selection.createRange();
        sel.text = str;
    } else if (domElement.selectionStart || domElement.selectionStart == '0') {
        // MOZILLA and others
        var begPos = domElement.selectionStart;
        var endPos = domElement.selectionEnd;
        var value  = domElement.value;
        domElement.value = value.substring(0, begPos)
            + str
            + value.substring(endPos, value.length);
        setTimeout(function () {
            domElement.selectionStart = begPos + str.length;
            domElement.selectionEnd   = begPos + str.length;
        }, 0);
    } else {
        // other
        domElement.value += str;
    }
}

var textareaElem = $('textarea').get(0);
$('button').click(function () {
    // string inside button (stripping off any &nbsp; + ◌).
    var str = $(this).html().replace(/(&nbsp;|◌)/g, '');
    insertAtCursor(textareaElem, str);
});

/*[eof]*/
