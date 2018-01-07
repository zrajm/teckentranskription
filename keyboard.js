/*jslint browser fudge */
/*global window $ */

// jqText is a jQuery DOM element in which to insert text (e.g. <textarea> or
// <input> element).
function transcriptKeyboard(jqText) {
    "use strict";
    var domText = jqText.get(0);
    var jqKeyboard = $("#keyboard");
    var jqInput = $("#input");

    // For inserting text in a textarea.
    function insertAtCursor(str) {
        var sel;
        var begPos;
        var endPos;
        var newPos;
        var value;
        var domFocused = document.activeElement;
        var refocused = false;

        // Focus text input element (if not already focused).
        if (domFocused !== domText) {
            domText.focus();
            refocused = true;
        }

        // Edit input field.
        if (document.selection) {
            // IE support
            sel = document.selection.createRange();
            sel.text = str;
        } else if (domText.selectionStart || domText.selectionStart === 0) {
            // MOZILLA and others
            begPos = domText.selectionStart;
            endPos = domText.selectionEnd;
            newPos = begPos + str.length;
            value = domText.value;

            // Replace string & move cursor.
            domText.value = value.slice(0, begPos) + str + value.slice(endPos);
            domText.setSelectionRange(newPos, newPos);
        } else {
            // other
            domText.value += str;
        }

        // Refocus original element.
        if (refocused) {
            domFocused.focus();
        }
    }

    // Invoke this on .mousedown() and/or .keydown() (to catch mouse clicks and
    // keyboard input respectively). This will prevent default function of an
    // element it is attached to (specifically, if attached to .mousedown(), this
    // will prevent the button from being focused when clicked -- so that the
    // previously focused element keeps its focus; this will not worked for
    // .click() as the element is already focused when that event is triggered).
    function button_clicked(e) {
        var str;
        if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
            return true;
        }
        switch (e.which) {
        case 27:                     // Escape
            e.preventDefault();
            jqKeyboard.hide();
            jqText.focus();
            break;
        case 1:                      // Left mouse button
        case 13:                     // Enter
        case 32:                     // Space
            e.preventDefault();
            if ($(e.target).is("button")) {
                // String inside button (stripping off any &nbsp; + ◌).
                str = $(e.target).html().replace(/(&nbsp;|◌)/g, "");
                insertAtCursor(str);
            }
            break;
        }
        return true;
    }

    $(function () {
        jqKeyboard
            .mousedown(button_clicked)
            .keydown(button_clicked);
        jqText
            .keydown(function (e) {
                if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
                    return true;
                }
                switch (e.key) {
                case "Escape":
                    e.preventDefault();
                    jqKeyboard.toggle();
                    break;
                case "Enter":
                    e.preventDefault();
                    jqText.change();
                    break;
                }
            })
            .change(function () {
                jqKeyboard.hide();
            })
            .click(function () {
                jqKeyboard.show();
            });

        // Hide screen keyboard if focus goes outside it or text field.
        jqInput.focusout(function (e) {
            var domFocused = $(e.relatedTarget);
            if (domFocused.closest(jqInput, jqInput).length === 0) {
                jqKeyboard.hide();
            }
        });
    });
}

/*[eof]*/
