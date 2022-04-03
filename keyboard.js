/* -*- js-indent-level: 2 -*- */
/* global $:readonly */
/* exported transcriptKeyboard */

// $input is a jQuery DOM element in which to insert text (a <textarea> or
// <input> element). This element will be wrapped in a container element
// ($wrapper), and a virtual keyboard ($keyboard) will added at the end of the
// container.
function transcriptKeyboard($wrapper, $input, $keyboardIcon) {
  'use strict'

  // Insert text in a textarea.
  let input = $input[0]  // DOM input element
  function insertAtCursor(str) {
    let focused = document.activeElement  // focused DOM element
    let refocused = false

    // Focus text input element (if not already focused).
    if (focused !== input) {
      input.focus()
      refocused = true
    }

    // Edit input field.
    if (document.selection) {
      // IE support
      let sel = document.selection.createRange()
      sel.text = str
    } else if (input.selectionStart || input.selectionStart === 0) {
      // MOZILLA and others
      let begPos = input.selectionStart
      let endPos = input.selectionEnd
      let newPos = begPos + str.length
      let value = input.value

      // Replace string & move cursor.
      input.value = value.slice(0, begPos) + str + value.slice(endPos)
      input.setSelectionRange(newPos, newPos)
    } else {
      // other
      input.value += str
    }

    // Refocus original element.
    if (refocused) {
      focused.focus()
    }
  }

  function onButton(e) {
    let k = e.which
    if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
      return
    }
    if (k === 1 || k === 13 || k === 32) {  // Click, enter or space
      e.preventDefault()
      if ($(e.target).is('button')) {
        // String inside button (stripping off any &nbsp; + ◌).
        let str = $(e.target).html().replace(/(&nbsp;|◌)/g, '')
        insertAtCursor(str)
      }
    }
  }

  function insertKeyboardInDom($wrapper) {
    let keyboardHtml = [[
      { prefix: 'Relation: ' },
      '<nobr>',
      ['◌􌤺', 'Brevid'],
      ['◌􌥛', 'Framför'],
      ['◌􌤻', 'Innanför'],
      ['◌􌤹', 'Ovanför'],
      ['◌􌥚', 'Nedanför'],
      '</nobr>',
    ], [
      { prefix: 'Attityd: ' },
      '<nobr>',
      ['􌥓', 'Vänsterriktad'],
      ['􌥔', 'Högerriktad'],
      ['􌤴', 'Framåtriktad'],
      '</nobr>',
      ['􌥕', 'Inåtriktad'],
      ['􌤵', 'Uppåtriktad'],
      ['􌥖', 'Nedåtriktad'],
      ['&nbsp;&nbsp;􌤶', 'Vänstervänd'],
      ['&nbsp;&nbsp;􌥗', 'Högervänd'],
      ['&nbsp;&nbsp;􌤷', 'Framåtvänd'],
      '<nobr>',
      ['&nbsp;&nbsp;􌥘', 'Inåtvänd'],
      ['&nbsp;&nbsp;􌤸', 'Uppåtvänd'],
      ['&nbsp;&nbsp;􌥙', 'Nedåtvänd'],
      '</nobr>',
    ], [
      { prefix: 'Läge: ' },
      '<nobr>',
      ['􌤆', 'Ansikte'],
      ['􌤂', 'Övre ansikte'],
      ['􌥞', 'Undre ansikte'],
      '</nobr>',
      ['􌤀', 'Hjässa'],
      ['􌤃', 'Panna'],
      ['􌤄', 'Ögon'],
      ['􌤅', 'Öga'],
      ['􌤾', 'Öra'],
      ['􌤈', 'Vänster öra'],
      ['􌤇', 'Höger öra'],
      ['􌤉', 'Kinder'],
      ['􌤋', 'Vänster kind'],
      ['􌤊', 'Höger kind'],
      ['􌤼', 'Näsa'],
      ['􌤌', 'Mun'],
      ['􌤛', 'Haka'],
      ['􌤜', 'Nacke'],
      ['􌤞', 'Hals'],
      ['􌤠', 'Axlar'],
      ['􌥀', 'Vänster axel'],
      ['􌤡', 'Höger axel'],
      ['􌥜', 'Arm'],
      ['􌤑', 'Överarm'],
      ['􌦲', 'Armvecket'],
      ['􌤒', 'Underarm'],
      ['􌤓', 'Bröst'],
      ['􌤕', 'Vänster bröst'],
      ['􌤔', 'Höger bröst'],
      ['􌤖', 'Mage'],
      ['􌤗', 'Höfter'],
      '<nobr>',
      ['􌤙', 'Vänster höft'],
      ['􌤘', 'Höger höft'],
      ['􌤚', 'Ben'],
      '</nobr>',
    ], [
      { prefix: 'Handform: ' },
      '<nobr>',
      ['􌤤', ['a-hand', 'A-hand']],
      ['􌥄', ['tumvinkelhand', 'Tumvinkelhand']],
      ['􌤣', ['vinkelhand', 'Vinkelhand']],
      '</nobr>',
      ['􌤧', ['tumhand', 'Tumhand']],
      ['􌥋', ['matthand', 'Måtthand'], ['kopa-hand', 'Köpa-handen']],
      ['􌥉', ['rak-matthand', 'Rak måtthand']],
      ['􌦫', ['d-hand', 'D-hand']],
      ['􌤩', ['nyphand-a', 'Nyphand A'], ['nyphand-b', 'Nyphand B']],
      ['􌤎', ['liten-o-hand-a', 'Liten O-hand A'],
            ['liten-o-hand-b', 'Liten O-hand B']],
      ['􌥇', ['e-hand', 'E-hand']],
      ['􌦬', ['stor-hallhand', 'Stor hållhand']],
      ['􌤦', ['knuten-hand', 'Knuten hand']],
      ['􌤲', ['stor-nyphand', 'Stor nyphand']],
      ['􌤱', ['lillfinger', 'Lillfinger']],
      ['􌥑', ['flyghand', 'Flyghand']],
      ['􌤢', ['flat-hand', 'Flat hand']],
      ['􌥂', ['flat-tumhand', 'Flat tumhand']],
      ['􌤪', ['krokfinger', 'Krokfinger']],
      ['􌥎', ['k-hand', 'K-hand']],
      ['􌥈', ['pekfinger', 'Pekfinger'],
            ['vinklat-pekfinger', 'Vinklat pekfinger']],
      ['􌤨', ['l-hand', 'L-hand']],
      ['􌤿', ['m-hand', 'M-hand']],
      ['􌥌', ['n-hand', 'N-hand'], ['n-tumhand', 'N-tumhand'],
            ['vinklad-n-hand', 'Vinklad N-hand'],
            ['vinklad-n-tumhand', 'Vinklad N-tumhand']],
      ['􌥆', ['o-hand', 'O-hand']],
      ['􌤫', ['hallhand', 'Hållhand']],
      ['􌦭', ['q-hand', 'Q-hand']],
      ['􌤬', ['langfinger', 'Långfinger'],
            ['vinklat-langfinger', 'Vinklat långfinger']],
      ['􌥅', ['s-hand', 'S-hand'], ['s-tumhand', 'S-tumhand']],
      ['􌤥', ['klohand', 'Klohand'], ['matte-hand', 'Matte-hand']],
      ['􌥊', ['t-hand', 'T-hand']],
      ['􌦱', ['u-hand', 'U-hand']],
      ['􌤽', ['dubbelkroken', 'Dubbelkrok']],
      ['􌤯', ['bojd-tupphand', 'Böjd tupphand']],
      ['􌤭', ['v-hand', 'V-hand']],
      ['􌤮', ['tupphand', 'Tupphand']],
      ['􌤰', ['w-hand', 'W-hand']],
      ['􌤳', ['x-hand', 'X-hand']],
      ['􌥃', ['sprethand', 'Sprethand'],
            ['vinkad-sprethand', 'Vinklad sprethand']],
      '<nobr>',
      ['􌥒', ['stort-langfinger', 'Stort långfinger']],
      ['􌥟', ['runt-langfinger', 'Runt långfinger']],
      ['􌦪', ['4-hand', '4-hand']],
      '</nobr>',
    ], [
      {},
      '<nobr>',
      ['&nbsp;&nbsp;􌥡', 'Medial kontakt (modifierande)'],
      ['􌤟', 'Kontakt'],
      ['􌦑', 'Hålls stilla'],
      '</nobr>',
      ['􌥢', 'Förs åt vänster'],
      ['􌥣', 'Förs åt höger'],
      ['􌥤', 'Förs i sidled'],
      ['􌦃', 'Förs framåt'],
      ['􌦄', 'Förs inåt/bakåt'],
      ['􌥥', 'Förs i djupled'],
      ['􌥦', 'Förs uppåt'],
      ['􌥧', 'Förs nedåt'],
      ['􌥨', 'Förs i höjdled'],
      ['􌥩', 'Förs kort åt vänster'],
      ['􌥪', 'Förs kort åt höger'],
      ['􌥵', 'Förs kort framåt'],
      ['􌥶', 'Förs kort inåt/bakåt'],
      ['􌥷', 'Förs kort uppåt'],
      ['􌥸', 'Förs kort nedåt'],
      ' ',
      ['􌥹', 'Divergerar'],
      ['􌦅', 'Konvergerar'],
      ['􌦎', 'Korsas'],
      ['􌥫', 'Hakas'],
      ['􌥬', 'Byter plats'],
      ['􌥭', 'Gör entré'],
      ['􌥮', 'I vinkel'],
      ' ',
      ['􌥳', 'Spelar'],
      ['􌥴', 'Strör'],
      ['􌦨', 'Böjs'],
      '<nobr>',
      ['􌥺', 'Vinkar'],
      ['􌦆', 'Förändras'],
      ['􌦇', 'Växelvis'],
      '</nobr>',
    ], [
      {},
      '<nobr>',
      ['􌥯', 'Båge'],
      ['􌥰', 'Cirkel'],
      ['􌥱', 'Slås'],
      '</nobr>',
      ['􌥲', 'Vrids'],
      ['&nbsp;&nbsp;􌦈', 'Åt vänster'],
      ['&nbsp;&nbsp;􌥽', 'Åt höger'],
      ['&nbsp;&nbsp;􌦉', 'I sidled'],
      ['&nbsp;&nbsp;􌥾', 'Framåt'],
      ['&nbsp;&nbsp;􌦊', 'Inåt/bakåt'],
      ['&nbsp;&nbsp;􌦋', 'I djupled'],
      ['&nbsp;&nbsp;􌥿', 'Uppåt'],
      '<nobr>',
      ['&nbsp;&nbsp;􌦀', 'Nedåt'],
      ['&nbsp;&nbsp;􌦌', 'I höjdled'],
      ['&nbsp;&nbsp;􌦂', 'Mot varandra'],
      '</nobr>',
    ], [
      {},
      '<nobr>',
      ['􌥻', 'Upprepning'],
      ['􌥼', 'Separator mellan artikulationer'],
      ['􌥠', 'Separator mellan segment'],
      ['􌦩', 'Separator mellan händer'],
      '</nobr>',
    ], [
      {},
      '<nobr><div style="display:inline-block;font-size:.5em;line-height:120%">Följande symboler är nya<br>och används inte i lexikon än:</div> ',
      ['􌦳', 'Läge: Neutrala läget'],
      '</nobr>',
      ['􌦷', 'Medial kontakt (oberoende)'],
      ['􌦴', 'Flätas'],
      ['􌦮', 'Cirkel i frontalplan<br>(matchar 􌦮 och 􌥰􌥿􌥰􌦀􌥰􌦌)'],
      ['􌦯', 'Cirkel i horisontalplan<br>(matchar 􌦯 och 􌥰􌦈􌥰􌥽􌥰􌦉)'],
      '<nobr>',
      ['􌦰', 'Cirkel i sagittalplan<br>(matchar 􌦰 och 􌥰􌥾􌥰􌦊􌥰􌦋)'],
      ['􌦶', 'Studs'],
      ['&nbsp;&nbsp;􌦵', 'Från varandra'],
      '</nobr>',
    ]].map(([meta, ...units]) => {
      return '<span>'
        + units.map(unit => {
          if (typeof unit === 'string') {  // raw HTML
            return unit
          }
          let [label, ...txts] = unit
          let prefix = meta.prefix || ''
          function imgText(txts) {
            if (typeof txts[0] === 'string') { return txts[0] }
            return '<br><div class=imgs>' + txts.map(([img, txt], i) => (
              `<span><img src=&quot;pic/keyboard/${img}.png&quot;>${txt}</span>`
                + ((i % 2) ? '<br>' : '')
            )).join('') + '</div>'
          }
          return `<button title="${prefix}${imgText(txts)}">${label}</button>`
        }).join('') + '</span>'
    }).join(' ')
    return $(`<div id=keyboard>${keyboardHtml}</div>`)
      .appendTo($wrapper)
      .hide()
  }

  $(() => {
    let $keyboard = insertKeyboardInDom($wrapper)

    $keyboard.on('click', 'button', onButton)

    // Escape anywhere inside form: Toggle virtual keyboard.
    $wrapper.on('keydown', e => {
      if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
        return
      }
      let k = e.which
      if (k === 27) {  // Escape
        e.preventDefault()
        $keyboard.toggle()
        if (!$(e.target).is(':visible')) {
          $input.focus()
        }
      }
    })

    // Click on keyboard icon: Toggle virtual keyboard.
    $keyboardIcon.on('click', e => {
      if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
        return
      }
      e.preventDefault()
      $keyboard.toggle()
    })

    // Click/focus outside virtual keyboard: Hide it.
    $(document.body).on('click focus', e => {
      if ($(e.target).closest($wrapper).length === 0) {
        $keyboard.hide()
      }
    })

    // Submit: Hide virtual keyboard.
    $wrapper.on('submit', () => {
      $keyboard.hide()
    })
  })
}

/*[eof]*/
