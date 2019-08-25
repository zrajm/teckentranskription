/*jslint browser fudge */
/*global window $ */

// jqInput is a jQuery DOM element in which to insert text (a <textarea> or
// <input> element). This element will be wrapped in a container element
// (jqWrapper), and a virtual keyboard (jqKeyboard) will added at the end of
// the container.
function transcriptKeyboard(jqWrapper, jqInput, jqKeyboardIcon) {
    "use strict";
    var domInput = jqInput.get(0);
    var jqKeyboard;

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

    function onButton(e) {
        var k = e.which;
        var str;
        if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
            return;
        }
        if (k === 1 || k === 13 || k === 32) {  // Click, enter or space
            e.preventDefault();
            if ($(e.target).is("button")) {
                // String inside button (stripping off any &nbsp; + ◌).
                str = $(e.target).html().replace(/(&nbsp;|◌)/g, "");
                insertAtCursor(str);
            }
        }
    }

    function insertKeyboardInDom(jqWrapper) {
        var keyboardHtml = [[
            {prefix: "Relation: "},
            "<nobr>",
            ["◌􌤺", "Brevid"],
            ["◌􌥛", "Framför"],
            ["◌􌤻", "Innanför"],
            ["◌􌤹", "Ovanför"],
            ["◌􌥚", "Nedanför"],
            "</nobr>"
        ], [
            {prefix: "Attityd: "},
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
            {prefix: "Läge: "},
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
            ["􌦲", "Armvecket"],
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
            {prefix: "Handform: "},
            "<nobr>",
            ["􌤤", "A-hand", "a-handen-1"],
            ["􌥄", "Tumvinkelhand", "tumvinkelhanden-1"],
            ["􌤣", "Vinkelhand", "vinkelhanden-1"],
            "</nobr>",
            ["􌤧", "Tumhand", "tumhanden-1"],
            ["􌥋", "Måtthand", "matthanden-1"],
            ["􌥉", "Rak måtthand", "raka-matthanden-1"],
            ["􌦫", "D-hand", "d-handen-1"],
            ["􌤩", "Nyphand", "nyphanden-1"],
            ["􌤎", "Liten o-hand", "lilla-o-handen-1"],
            ["􌥇", "E-hand", "e-handen-1"],
            ["􌦬", "F-hand", "stora-nyphanden-5"],
            ["􌤦", "Knuten hand", "knutna-handen-1"],
            ["􌤲", "Stor nyphand", "stora-nyphanden-1"],
            ["􌤱", "Lillfinger", "lillfingret-1"],
            ["􌥑", "Flyghand", "flyghanden-1"],
            ["􌤢", "Flat hand", "flata-handen-1"],
            ["􌥂", "Flat tumhand", "flata-tumhanden-1"],
            ["􌤪", "Krokfinger", "krokfingret-1"],
            ["􌥎", "K-hand", "k-handen-1"],
            ["􌥈", "Pekfinger", "pekfingret-1"],
            ["􌤨", "L-hand", "l-handen-1"],
            ["􌤿", "M-hand", "m-handen-1"],
            ["􌥌", "N-hand", "n-handen-1"],
            ["􌥆", "O-hand", "o-handen-1"],
            ["􌤫", "Hållhand", "hallhanden-1"],
            ["􌦭", "Q-hand", "q-handen-1"],
            ["􌤬", "Långfingret", "langfingret-1"],
            ["􌥅", "S-hand", "s-handen-1"],
            ["􌤥", "Klohand", "klohanden-1"],
            ["􌥊", "T-hand", "t-handen-1"],
            ["􌤽", "Dubbelkrok", "dubbelkroken-1"],
            ["􌤯", "Böjd tupphand", "bojda-tupphanden-1"],
            ["􌤭", "V-hand", "v-handen-1"],
            ["􌤮", "Tupphand", "tupphanden-1"],
            ["􌤰", "W-hand", "w-handen-1"],
            ["􌤳", "X-hand", "x-handen-1"],
            ["􌥃", "Sprethand", "sprethanden-1"],
            "<nobr>",
            ["􌥒", "Stort långfinger", "stora-langfingret-1"],
            ["􌥟", "Runt långfinger", "runda-langfingret-1"],
            ["􌦪", "4-hand", "4-handen-1"],
            "</nobr>"
        ], [
            {},
            "<nobr>",
            ["&nbsp;&nbsp;􌥡", "Medial kontakt (modifierande)"],
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
            {},
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
            ["&nbsp;&nbsp;􌦂", "Mot varandra"],
            "</nobr>"
        ], [
            {},
            "<nobr>",
            ["􌥻", "Upprepning"],
            ["􌥼", "Separator mellan artikulationer"],
            ["􌥠", "Separator mellan segment"],
            ["􌦩", "Separator mellan händer"],
            "</nobr>"
        ], [
            {},
            "<nobr><div style=\"display:inline-block;font-size:.5em;line-height:120%\">Följande symboler är nya<br>och används inte i lexikon än:</div> ",
            ["􌦱", "Handform: Lamahanden"],
            ["􌦳", "Läge: Neutrala läget"],
            "</nobr>",
            ["􌦷", "Medial kontakt (oberoende)"],
            ["􌦴", "Flätas"],
            ["􌦮", "Cirkel i frontalplan<br>(matchar 􌦮 och 􌥰􌥿􌥰􌦀􌥰􌦌)"],
            ["􌦯", "Cirkel i horisontalplan<br>(matchar 􌦯 och 􌥰􌦈􌥰􌥽􌥰􌦉)"],
            "<nobr>",
            ["􌦰", "Cirkel i sagittalplan<br>(matchar 􌦰 och 􌥰􌥾􌥰􌦊􌥰􌦋)"],
            ["􌦶", "Studs"],
            ["&nbsp;&nbsp;􌦵", "Från varandra"],
            "</nobr>"
        ]].map(function (x) {
            var attr = x[0];
            return "<span>" + x
                .splice(1).map(function (y) {
                    var title;
                    if (typeof y === "string") {        // raw HTML
                        return y;
                    }
                    title = (attr.prefix || "") + y[1]; // title
                    if (y[2] !== undefined) {           //   with optional image
                        title = title + "<img src='pic/x/" + y[2] + ".png'>";
                    }
                    return "<button title=\"" + title + "\">" + y[0] + "</button>";
                }).join("") + "</span>";
        }).join(" ");
        return $("<div id=keyboard>" + keyboardHtml + "</div>")
            .appendTo(jqWrapper)
            .hide();
    }

    $(function () {
        jqKeyboard = insertKeyboardInDom(jqWrapper);

        jqKeyboard.on("click", "button", onButton);

        // Escape anywhere inside form: Toggle virtual keyboard.
        jqWrapper.on("keydown", function (e) {
            var k = e.which;
            if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
                return;
            }
            if (k === 27) {                     // Escape
                e.preventDefault();
                jqKeyboard.toggle();
                if (!$(e.target).is(":visible")) {
                    jqInput.focus();
                }
            }
        });

        // Click on keyboard icon: Toggle virtual keyboard.
        jqKeyboardIcon.on("click", function (e) {
            if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
                return;
            }
            e.preventDefault();
            jqKeyboard.toggle();
        });

        // Click/focus outside it virtual keyboard: Hide it.
        $(document.body).on("click focus", function (e) {
            if ($(e.target).closest(jqWrapper).length === 0) {
                jqKeyboard.hide();
            }
        });

        // Submit: Hide virtual keyboard.
        jqWrapper.on("submit", function () {
            jqKeyboard.hide();
        });
    });
}

/*[eof]*/
