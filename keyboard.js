// jqText is a jQuery DOM element in which to insert text (e.g. <textarea> or
// <input> element).
function transcriptKeyboard(jqText) {
    var domText = jqText.get(0), jqKeyboard = $('#keyboard')

    // For inserting text in a textarea.
    function insertAtCursor(str) {
        var sel, begPos, endPos, value
        if (document.selection) {
            // IE support
            domText.focus()
            sel = document.selection.createRange()
            sel.text = str
        } else if (domText.selectionStart || domText.selectionStart == '0') {
            // MOZILLA and others
            begPos = domText.selectionStart
            endPos = domText.selectionEnd
            value  = domText.value
            domText.value = value.substring(0, begPos)
                + str
                + value.substring(endPos, value.length)
            setTimeout(function () {
                domText.selectionStart = begPos + str.length
                domText.selectionEnd   = begPos + str.length
            }, 0)
        } else {
            // other
            domText.value += str
        }
    }

    // Invoke this on .mousedown() and/or .keydown() (to catch mouse clicks and
    // keyboard input respectively). This will prevent default function of an
    // element it is attached to (specifically, if attached to .mousedown(), this
    // will prevent the button from being focused when clicked -- so that the
    // previously focused element keeps its focus; this will not worked for
    // .click() as the element is already focused when that event is triggered).
    function button_clicked(event) {
        var key
        if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
            return true
        }

        // Pressed: Left mouse button, enter or space.
        key = event.which
        if (key === 1 || key === 13 || key === 32) {
            event.preventDefault()

            // string inside button (stripping off any &nbsp; + ◌).
            var str = $(this).html().replace(/(&nbsp;|◌)/g, '')
            insertAtCursor(str)
        }
        return true
    }

    $(function () {
        jqKeyboard
            .width(jqText.width())
            .find('button').mousedown(button_clicked).keydown(button_clicked)
        jqText.keyup(function (e) {
            if (e.key === 'Escape') {
                jqKeyboard.toggle()
            } else if (e.key === 'Enter') {
                jqText.change()
            }
        }).change(function() { jqKeyboard.hide() })
    })
}

/*[eof]*/
