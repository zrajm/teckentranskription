
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
$('button').mousedown(button_clicked).keydown(button_clicked);

// Invoke this on .mousedown() and/or .keydown() (to catch mouse clicks and
// keyboard input respectively). This will prevent default function of an
// element it is attached to (specifically, if attached to .mousedown(), this
// will prevent the button from being focused when clicked -- so that the
// previously focused element keeps its focus; this will not worked for
// .click() as the element is already focused when that event is triggered).
function button_clicked(event) {
    var key;

    // Abort if qualifier key was pressed.
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
        return true;
    }

    // Pressed: Left mouse button, enter or space.
    key = event.which;
    if (key === 1 || key === 13 || key === 32) {
        event.preventDefault();

        // string inside button (stripping off any &nbsp; + ◌).
        var str = $(this).html().replace(/(&nbsp;|◌)/g, '');
        insertAtCursor(textareaElem, str);
    }
    return true;
}

/*[eof]*/
