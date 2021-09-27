/* -*- js-indent-level: 2 -*- */
/* global $:false, domtoimage:false, jQuery:false */

jQuery.fn.selectText = function () {
  'use strict'
  let element = this[0]
  if (document.body.createTextRange) {
    let range = document.body.createTextRange()
    range.moveToElementText(element)
    range.select()
  } else if (window.getSelection) {
    let selection = window.getSelection()
    let range = document.createRange()
    range.selectNodeContents(element)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

// For inserting text in a textarea.
function insertAtCursor($element, str) {
  'use strict'
  let element = $element[0]
  if (document.selection) {
    // IE support
    element.focus()
    let sel = document.selection.createRange()
    sel.text = str
  } else if (element.selectionStart || element.selectionStart === 0) {
    // MOZILLA and others
    let begPos = element.selectionStart
    let endPos = element.selectionEnd
    let value = element.value
    element.value = `${value.slice(0, begPos)}${str}${value.slice(endPos)}`
    element.selectionStart = element.selectionEnd = begPos + str.length
  } else {
    // other
    element.value += str
  }
}

// Invoke this on .mousedown() and/or .keydown() (to catch mouse clicks and
// keyboard input respectively). This will prevent default function of an
// element it is attached to (specifically, if attached to .mousedown(), this
// will prevent the button from being focused when clicked -- so that the
// previously focused element keeps its focus; this will not worked for
// .click() as the element is already focused when that event is triggered).
let $textarea = $('main textarea')
function buttonClicked(event) {
  'use strict'
  let key = event.which

  // Pressed: Left mouse button, enter or space.
  if (key === 1 || key === 13 || key === 32) {
    event.preventDefault()

    // String inside button (without any &nbsp; + ◌).
    let str = $(event.currentTarget).html().replace(/(&nbsp;|◌)/g, '')
    insertAtCursor($textarea, str)
  }
  return true
}

// Trigger hashchange on pageload.
$(() => {
  'use strict'
  $(window).trigger('hashchange')
})

// Update transcript based on URL hash.
$(window).on('hashchange', () => {
  'use strict'
  let hash = window.location.hash
  let decoded = decodeURIComponent(hash.replace(/^#/, ''))
  shareClose()
  $textarea.val(decoded)

  // Remove hash fragment from URL.
  let url = location.href.replace(location.hash, '')
  window.history.replaceState({}, '', url)
})

// Don't close share bubble on click in share bubble.
$('.bubble').mousedown(event => {
  'use strict'
  event.stopPropagation()
})

// Close share bubble on click anywhere outside share bubble.
$(document.body).mousedown(() => {
  'use strict'
  shareClose()
})

let shareOpened = false
function shareClose() {
  'use strict'
  $('.share .bubble').hide()
  shareOpened = false
}

function copyToClipboard(elem, goodMsg, failMsg) {
  'use strict'
  let msg = failMsg
  // Copy to clipboard if possible.
  try {
    if (document.execCommand('copy')) {
      msg = goodMsg
    }
  } catch (err) {}
  $('.share .msg').html(msg)
}
let createPreviewPNG = (() => {
  'use strict'
  let $preview = $('<div><div>')
    .prependTo('body')
    .css({
      position: 'fixed',
      left: 99999,
      top: 0,
    })
    .children()
    .css({
      whiteSpace: 'nowrap',
      display: 'table-cell',
      padding: '.125em 0 .025em',
    })
  return text => {
    $preview.text(text)
    return domtoimage.toPng($preview[0])
  }
})()
function shareToggle() {
  'use strict'
  if (shareOpened) { return shareClose() }
  shareOpened = true
  let text = $textarea.val()
  let hash = encodeURIComponent(text)
  let url = `${location.href.replace(location.hash, '')}#${hash}`
  let failMsg = 'Press Ctrl-C (or &#8984;-C) to copy link to clipboard!'
  $('.share .bubble').show()
  createPreviewPNG(text)
    .then(dataUrl => {
      // Insert URL + image into share bubble & select it.
      $('.share .url').html(
        `<img style="margin:0;display:block" src="${dataUrl}">${url}`
      ).selectText()
      copyToClipboard($('.share .msg'), 'Link + image copied to clipboard!', failMsg)
    })
    .catch(() => {
      // Insert URL into share bubble & select it.
      $('.share .url').html(url).selectText()
      copyToClipboard($('.share .msg'), 'Link copied to clipboard!', failMsg)
    })
}

function shareClicked(event) {
  'use strict'
  let key = event.which

  // Pressed: Left mouse button, enter or space.
  if (key === 1 || key === 13 || key === 32) {
    event.preventDefault()
    event.stopPropagation()
    shareToggle()
  }
  return true
}

/******************************************************************************/

$('main button').mousedown(buttonClicked).keydown(buttonClicked)
$('.share button').mousedown(shareClicked).keydown(shareClicked)

/******************************************************************************/

/* Hover images */

function updateHover(event) {
  'use strict'
  let $el = $(event.currentTarget)
  let html = ($el.data('src') || '').split(' ').map(img => {
    return img
      ? `<img src="pic/x/${img}.png" style="max-height:150px;margin:0;padding:0">`
      : ''
  }).join(' ')
    + `<div align=center class=x2>${$el.html()}</div>`
    + `<div align=center>${$el.attr('title')}</div>`
  $('#hover').html(html).show()
}

function hideHover() {
  'use strict'
  $('#hover').hide()
}

$('main button').hover(updateHover, hideHover).focus(updateHover)

/*[eof]*/
