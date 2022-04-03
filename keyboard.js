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
      ['􌤤', 'A-hand', 'a-handen-1'],
      ['􌥄', 'Tumvinkelhand', 'tumvinkelhanden-1'],
      ['􌤣', 'Vinkelhand', 'vinkelhanden-1'],
      '</nobr>',
      ['􌤧', 'Tumhand', 'tumhanden-1'],
      ['􌥋', 'Måtthand', 'matthanden-1'],
      ['􌥉', 'Rak måtthand', 'raka-matthanden-1'],
      ['􌦫', 'D-hand', 'd-handen-1'],
      ['􌤩', 'Nyphand', 'nyphanden-1'],
      ['􌤎', 'Liten o-hand', 'lilla-o-handen-1'],
      ['􌥇', 'E-hand', 'e-handen-1'],
      ['􌦬', 'Stor hållhand', 'stora-nyphanden-5'],
      ['􌤦', 'Knuten hand', 'knutna-handen-1'],
      ['􌤲', 'Stor nyphand', 'stora-nyphanden-1'],
      ['􌤱', 'Lillfinger', 'lillfingret-1'],
      ['􌥑', 'Flyghand', 'flyghanden-1'],
      ['􌤢', 'Flat hand', 'flata-handen-1'],
      ['􌥂', 'Flat tumhand', 'flata-tumhanden-1'],
      ['􌤪', 'Krokfinger', 'krokfingret-1'],
      ['􌥎', 'K-hand', 'k-handen-1'],
      ['􌥈', 'Pekfinger', 'pekfingret-1'],
      ['􌤨', 'L-hand', 'l-handen-1'],
      ['􌤿', 'M-hand', 'm-handen-1'],
      ['􌥌', 'N-hand', 'n-handen-1'],
      ['􌥆', 'O-hand', 'o-handen-1'],
      ['􌤫', 'Hållhand', 'hallhanden-1'],
      ['􌦭', 'Q-hand', 'q-handen-1'],
      ['􌤬', 'Långfinger', 'langfingret-1'],
      ['􌥅', 'S-hand', 's-handen-1'],
      ['􌤥', 'Klohand', 'klohanden-1'],
      ['􌥊', 'T-hand', 't-handen-1'],
      ['􌦱', 'U-hand'],
      ['􌤽', 'Dubbelkrok', 'dubbelkroken-1'],
      ['􌤯', 'Böjd tupphand', 'bojda-tupphanden-1'],
      ['􌤭', 'V-hand', 'v-handen-1'],
      ['􌤮', 'Tupphand', 'tupphanden-1'],
      ['􌤰', 'W-hand', 'w-handen-1'],
      ['􌤳', 'X-hand', 'x-handen-1'],
      ['􌥃', 'Sprethand', 'sprethanden-1'],
      '<nobr>',
      ['􌥒', 'Stort långfinger', 'stora-langfingret-1'],
      ['􌥟', 'Runt långfinger', 'runda-langfingret-1'],
      ['􌦪', '4-hand', '4-handen-1'],
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
          let [label, title, img] = unit
          let prefix = meta.prefix || ''
          let imgTag = img ? `<img src=&quot;pic/x/${img}.png&quot;>` : ''
          return `<button title="${prefix}${title}${imgTag}">${label}</button>`
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
