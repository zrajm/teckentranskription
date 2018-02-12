/*jslint browser fudge */
/*global window $ */

// jqInput is a jQuery DOM element in which to insert text (a <textarea> or
// <input> element). This element will be wrapped in a container element
// (jqWrapper), and a virtual keyboard (jqKeyboard) will added at the end of
// the container.
function transcriptKeyboard(jqInput) {
    "use strict";
    var domInput = jqInput.get(0);
    var jqWrapper;
    var jqKeyboard;
    var jqKeyboardIcon;

    // Insert text in a textarea.
    function insertAtCursor(str) {
        var sel;
        var begPos;
        var endPos;
        var newPos;
        var value;
        var domFocused = document.activeElement;
        var refocused = false;

        // Focus text input element (if not already focused).
        if (domFocused !== domInput) {
            domInput.focus();
            refocused = true;
        }

        // Edit input field.
        if (document.selection) {
            // IE support
            sel = document.selection.createRange();
            sel.text = str;
        } else if (domInput.selectionStart || domInput.selectionStart === 0) {
            // MOZILLA and others
            begPos = domInput.selectionStart;
            endPos = domInput.selectionEnd;
            newPos = begPos + str.length;
            value = domInput.value;

            // Replace string & move cursor.
            domInput.value = value.slice(0, begPos) + str + value.slice(endPos);
            domInput.setSelectionRange(newPos, newPos);
        } else {
            // other
            domInput.value += str;
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
            jqInput.focus();
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

    function insertKeyboardInDom(jqWrapper) {
        var keyboardHtml = [[
            {class: "relation", prefix: "Relation: "},
            "<nobr>",
            ["◌􌤺", "Brevid"],
            ["◌􌥛", "Framför"],
            ["◌􌤻", "Innanför"],
            ["◌􌤹", "Ovanför"],
            ["◌􌥚", "Nedanför"],
            "</nobr>"
        ], [
            {class: "attityd", prefix: "Attityd: "},
            "<nobr>",
            ["􌥓", "Vänsterriktad"],
            ["􌥔", "Högerriktad"],
            ["􌤴", "Framåtriktad"],
            "</nobr>",
            ["􌥕", "Inåtriktad"],
            ["􌤵", "Uppåtriktad"],
            ["􌥖", "Nedåtriktad"],
            ["&nbsp;&nbsp;􌤶", "Vänstervänd"],
            ["&nbsp;&nbsp;􌥗", "Högervänd"],
            ["&nbsp;&nbsp;􌤷", "Framåtvänd"],
            "<nobr>",
            ["&nbsp;&nbsp;􌥘", "Inåtvänd"],
            ["&nbsp;&nbsp;􌤸", "Uppåtvänd"],
            ["&nbsp;&nbsp;􌥙", "Nedåtvänd"],
            "</nobr>"
        ], [
            {class: "lage", prefix: "Läge: "},
            "<nobr>",
            ["􌤆", "Ansikte"],
            ["􌤂", "Övre ansikte"],
            ["􌥞", "Undre ansikte"],
            "</nobr>",
            ["􌤀", "Hjässa"],
            ["􌤃", "Panna"],
            ["􌤄", "Ögon"],
            ["􌤅", "Öga"],
            ["􌤾", "Öra"],
            ["􌤈", "Vänster öra"],
            ["􌤇", "Höger öra"],
            ["􌤉", "Kinder"],
            ["􌤋", "Vänster kind"],
            ["􌤊", "Höger kind"],
            ["􌤼", "Näsa"],
            ["􌤌", "Mun"],
            ["􌤛", "Haka"],
            ["􌤜", "Nacke"],
            ["􌤞", "Hals"],
            ["􌤠", "Axlar"],
            ["􌥀", "Vänster axel"],
            ["􌤡", "Höger axel"],
            ["􌥜", "Arm"],
            ["􌤑", "Överarm"],
            ["􌤒", "Underarm"],
            ["􌤓", "Bröst"],
            ["􌤕", "Vänster bröst"],
            ["􌤔", "Höger bröst"],
            ["􌤖", "Mage"],
            ["􌤗", "Höfter"],
            "<nobr>",
            ["􌤙", "Vänster höft"],
            ["􌤘", "Höger höft"],
            ["􌤚", "Ben"],
            "</nobr>"
        ], [
            {class: "handform", prefix: "Handform: "},
            "<nobr>",
            ["􌤤", "A-hand", "a-handen-1"],
            ["􌥄", "Tumvinkelhand", "tumvinkelhanden-1"],
            ["􌤣", "Vinkelhand", "vinkelhanden-1 vinkelhanden-2"],
            "</nobr>",
            ["􌤧", "Tumhand", "tumhanden-1 tumhanden-2"],
            ["􌥋", "Måtthand", "matthanden-1 matthanden-2 matthanden-3"],
            ["􌥉", "Rak måtthand", "raka-matthanden-1"],
            ["􌦫", "D-hand", "d-handen-1"],
            ["􌤩", "Nyphand", "nyphanden-1 nyphanden-2"],
            ["􌤎", "Liten o-hand", "lilla-o-handen-1 lilla-o-handen-2"],
            ["􌥇", "E-hand", "e-handen-1"],
            ["􌦬", "F-hand", "stora-nyphanden-5"],
            ["􌤦", "Knuten hand", "knutna-handen-1 knutna-handen-2"],
            ["􌤲", "Stor nyphand", "stora-nyphanden-1 stora-nyphanden-2 stora-nyphanden-3 stora-nyphanden-4 stora-nyphanden-5"],
            ["􌤱", "Lillfinger", "lillfingret-1 lillfingret-2"],
            ["􌥑", "Flyghand", "flyghanden-1 flyghanden-2 flyghanden-3"],
            ["􌤢", "Flat hand", "flata-handen-1 flata-handen-2"],
            ["􌥂", "Flat tumhand", "flata-tumhanden-1"],
            ["􌤪", "Krokfinger", "krokfingret-1"],
            ["􌥎", "K-hand", "k-handen-1"],
            ["􌥈", "Pekfinger", "pekfingret-1 vinklade-pekfingret"],
            ["􌤨", "L-hand", "l-handen-1"],
            ["􌤿", "M-hand", "m-handen-1"],
            ["􌥌", "N-hand", "n-handen-1 vinklade-n-handen-1 vinklade-n-handen-2"],
            ["􌥆", "O-hand", "o-handen-1"],
            ["􌤫", "Hållhand", "hallhanden-1"],
            ["􌦭", "Q-hand", "q-handen-1"],
            ["􌤬", "Långfingret", "langfingret-1"],
            ["􌥅", "S-hand", "s-handen-1 s-handen-2"],
            ["􌤥", "Klohand", "klohanden-1 klohanden-2 bojda-sprethanden-1 klohanden-3"],
            ["􌥊", "T-hand", "t-handen-1 t-handen-2"],
            ["􌤽", "Dubbelkrok", "dubbelkroken-1"],
            ["􌤯", "Böjd tupphand", "bojda-tupphanden-1"],
            ["􌤭", "V-hand", "v-handen-1"],
            ["􌤮", "Tupphand", "tupphanden-1 vinklade-tupphanden-1"],
            ["􌤰", "W-hand", "w-handen-1"],
            ["􌤳", "X-hand", "x-handen-1"],
            ["􌥃", "Sprethand", "sprethanden-1 4-handen-1 sprethanden-3"],
            "<nobr>",
            ["􌥒", "Stort långfinger", "stora-langfingret-1 stora-langfingret-2 stora-langfingret-3"],
            ["􌥟", "Runt långfinger", "runda-langfingret-1 runda-langfingret-2"],
            ["􌦪", "4-hand", "4-handen-1"],
            "</nobr>"
        ], [
            {class: "forflyttning"},
            "<nobr>",
            ["&nbsp;&nbsp;􌥡", "Medial kontakt"],
            ["􌤟", "Kontakt"],
            ["􌦑", "Hålls stilla"],
            "</nobr>",
            ["􌥢", "Förs åt vänster"],
            ["􌥣", "Förs åt höger"],
            ["􌥤", "Förs i sidled"],
            ["􌦃", "Förs framåt"],
            ["􌦄", "Förs inåt/bakåt"],
            ["􌥥", "Förs i djupled"],
            ["􌥦", "Förs uppåt"],
            ["􌥧", "Förs nedåt"],
            ["􌥨", "Förs i höjdled"],
            ["􌥩", "Förs kort åt vänster"],
            ["􌥪", "Förs kort åt höger"],
            ["􌥵", "Förs kort framåt"],
            ["􌥶", "Förs kort inåt/bakåt"],
            ["􌥷", "Förs kort uppåt"],
            ["􌥸", "Förs kort nedåt"],
            " ",
            ["􌥹", "Divergerar"],
            ["􌦅", "Konvergerar"],
            ["􌦎", "Korsas"],
            ["􌥫", "Hakas"],
            ["􌥬", "Byter plats"],
            ["􌥭", "Gör entré"],
            ["􌥮", "I vinkel"],
            " ",
            ["􌥳", "Spelar"],
            ["􌥴", "Strör"],
            ["􌦨", "Böjs"],
            "<nobr>",
            ["􌥺", "Vinkar"],
            ["􌦆", "Förändras"],
            ["􌦇", "Växelvis"],
            "</nobr>"
        ], [
            {class: "rorelse"},
            "<nobr>",
            ["􌥯", "Båge"],
            ["􌥰", "Cirkel"],
            ["􌥱", "Slås"],
            "</nobr>",
            ["􌥲", "Vrids"],
            ["&nbsp;&nbsp;􌦈", "Åt vänster"],
            ["&nbsp;&nbsp;􌥽", "Åt höger"],
            ["&nbsp;&nbsp;􌦉", "I sidled"],
            ["&nbsp;&nbsp;􌥾", "Framåt"],
            ["&nbsp;&nbsp;􌦊", "Inåt/bakåt"],
            ["&nbsp;&nbsp;􌦋", "I djupled"],
            ["&nbsp;&nbsp;􌥿", "Uppåt"],
            "<nobr>",
            ["&nbsp;&nbsp;􌦀", "Nedåt"],
            ["&nbsp;&nbsp;􌦌", "I höjdled"],
            ["&nbsp;&nbsp;􌦂", "Mot varann"],
            "</nobr>"
        ], [
            {class: "annat"},
            "<nobr>",
            ["􌥻", "Upprepning"],
            ["􌥼", "Separator mellan artikulationer"],
            ["􌥠", "Separator mellan segment"],
            ["􌦩", "Separator mellan händer"],
            "</nobr>"
        ], [
            {class: "framtida"},
            "<nobr><div style=\"display:inline-block;font-size:.5em;line-height:120%\">Följande symboler är nya<br>och används inte i lexikon än:</div> ",
            ["􌦱", "Handform: Lamahanden"],
            ["􌦳", "Läge: Neutrala läget"],
            "</nobr>",
            ["􌦲", "Läge: Armvecket"],
            ["􌦴", "Flätas"],
            ["􌦮", "Cirkel i frontalplan"],
            "<nobr>",
            ["􌦯", "Cirkel i horisontalplan"],
            ["􌦰", "Cirkel i medialplan"],
            ["&nbsp;&nbsp;􌦵", "Från varann"],
            "</nobr>"
        ]].map(function (x) {
            var attr = x[0];
            return "<span class=\"" + attr.class + "\">" + x
                .splice(1).map(function (y) {
                    return typeof y === "string"
                        ? y
                        : "<button title=\"" + (attr.prefix || "") +
                                y[1] + "\">" + y[0] + "</button>";
                }).join("") + "<span>";
        }).join(" ");
        return $(
            "<div>" +
                "<style>" +
                ".relation     button { background-color: #C77BC7; }" +
                ".attityd      button { background-color: #FCAA5D; }" +
                ".lage         button { background-color: #7B7BC7; }" +
                ".handform     button { background-color: #7BC77B; }" +
                ".forflyttning button { background-color: #C77B7B; }" +
                ".rorelse      button { background-color: #C77BC7; }" +
                ".annat        button { background-color: #FCAA5D; }" +
                ".framtida     button { background-color: #7B7BC7; }" +
                "</style>" +
                keyboardHtml +
                "</div>"
        )
            .appendTo(jqWrapper)
            .css({
                borderRadius: "4px",
                minWidth: "100%",
                position: "absolute",
                zIndex: 1,
                background: "#fff",
                boxShadow: "0 16px 24px 2px rgba(0,0,0,.14)," +
                        "0 6px 30px 5px rgba(0,0,0,.12)," +
                        "0 8px 10px -5px rgba(0,0,0,.4)",
                lineHeight: 0,
                padding: ".125em"
            })
            .hide();
    }

    $(function () {
        jqWrapper = jqInput.wrap("<div class=wrap>").parent().css({
            lineHeight: "0",
            position: "relative"
        });
        jqKeyboardIcon = $(
            "<button id=\"kb-icon\" class=nostyle>" +
                "<img title=\"Transkriptionssymboler (Esc)\" " +
                "src=\"pic/gui/keyboard.svg\" style=\"height:1em;display:block\">" +
                "</button>"
        ).appendTo(jqWrapper).css({
            margin: "auto",
            padding: "0 .5em",
            top: 0,
            right: 0,
            position: "absolute",
            zIndex: 9999,
            display: "block",
            border: 0,
            height: "100%"
        });
        jqKeyboard = insertKeyboardInDom(jqWrapper);
        jqInput.css({
            width: "100%",
            margin: 0,
            overflow: "hidden",
            whiteSpace: "pre",
            resize: "none"
        }).focus();

        jqKeyboard
            .mousedown(button_clicked)
            .keydown(button_clicked);
        jqInput
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
                    jqInput.change();
                    break;
                }
            })
            .change(function () {
                jqKeyboard.hide();
            });

        jqKeyboardIcon.click(function () {
            jqKeyboard.toggle();
        });

        // Hide screen keyboard if focus goes outside it or text field.
        jqWrapper.focusout(function (e) {
            var domFocused = $(e.relatedTarget);
            if (domFocused.closest(jqWrapper, jqWrapper).length === 0) {
                jqKeyboard.hide();
            }
        });
    });
}

/*[eof]*/
