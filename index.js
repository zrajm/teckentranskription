jQuery.fn.selectText = function () {
    var doc = document, element = this[0], range, selection;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

// For inserting text in a textarea.
function insertAtCursor(jqElement, str) {
    var domElement = jqElement.get(0);
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

function qualifier(event) {
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
        return true;
    }
    return false;
}

// Invoke this on .mousedown() and/or .keydown() (to catch mouse clicks and
// keyboard input respectively). This will prevent default function of an
// element it is attached to (specifically, if attached to .mousedown(), this
// will prevent the button from being focused when clicked -- so that the
// previously focused element keeps its focus; this will not worked for
// .click() as the element is already focused when that event is triggered).
var jqTextarea  = $('main textarea');
function button_clicked(event) {
    var key;
    if (qualifier(event)) { return true; }     // abort if qualifier pressed

    // Pressed: Left mouse button, enter or space.
    key = event.which;
    if (key === 1 || key === 13 || key === 32) {
        event.preventDefault();

        // string inside button (stripping off any &nbsp; + ◌).
        var str = $(this).html().replace(/(&nbsp;|◌)/g, '');
        insertAtCursor(jqTextarea, str);
    }
    return true;
}

// Trigger hashchange on pageload.
$(function () { $(window).trigger('hashchange') });

// Update transcript based on URL hash.
$(window).on('hashchange', function () {
    var hash    = window.location.hash,
        decoded = decodeURI(hash.replace(/^#/, '')), url;
    share_close();
    jqTextarea.val(decoded);

    // Remove hash fragment from URL.
    url = location.href.replace(location.hash, '');
    window.history.replaceState({}, '', url);
});

// Don't close share bubble on click in share bubble.
$('.bubble').mousedown(function (event) { event.stopPropagation(); });

// Close share bubble on click anywhere outside share bubble.
$(document.body).mousedown(function (event) { share_close(); });

var share_opened = false;
function share_close() {
    $('.share .bubble').hide();
    share_opened = false;
}
function share_toggle() {
    if (share_opened) { return share_close(); }
    share_opened = true;
    var hash = encodeURI(jqTextarea.val());
    var url  = location.href.replace(location.hash, '') + '#' + hash;
    var msg  = 'Press Ctrl-C (or &#8984;-C) to copy link to clipboard!';
    $('.share .bubble').show();

    // Insert URL into share bubble & select it.
    $('.share .url').text(url).selectText();

    // Copy to clipboard if possible.
    try {
        if (document.execCommand('copy')) {
            msg = 'Link copied to clipboard!';
        }
    } catch (err) {}
    $('.share .msg').html(msg);
}

function share_clicked(event) {
    var key;
    if (qualifier(event)) { return true; }     // abort if qualifier pressed

    // Pressed: Left mouse button, enter or space.
    key = event.which;
    if (key === 1 || key === 13 || key === 32) {
        event.preventDefault();
        event.stopPropagation();
        share_toggle();
    }
    return true;
}

/******************************************************************************/

$('main button').mousedown(button_clicked).keydown(button_clicked);
$('.share button').mousedown(share_clicked).keydown(share_clicked);

/*[eof]*/
