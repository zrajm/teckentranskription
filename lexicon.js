/* -*- js-indent-level: 2 -*- */
/* global $:readonly, jQuery:readonly */
/* globals lexicon, lexiconDate */

// String method `STR.fmt(OBJ)`. Replace all {...} expressions in STR with OBJ
// property of same name. Return the new string.
//
//   'Hello {str}!'.fmt({str: 'world'})       => 'Hello world!'
//   'Hello {0} & {1}!'.fmt(['Alice', 'Bob']) => 'Hello Alice & Bob!'
//
String.prototype.fmt = function (o) { // eslint-disable-line no-extend-native
  'use strict'
  return this.replace(/\{([^{}]*)\}/g, (a, b) => {
    let r = o[b]
    return typeof r === 'string' || typeof r === 'number' ? r : a
  })
}

// jQuery plugin to insert a string at caret position in <textarea> &
// <input> and also scroll element content to caret after paste. (Does
// not work with 'contenteditable'.)
//
// Uses .selectionStart/.selectionEnd, i.e. works on:
// Chrome, Firefox, MSIE 9+, Edge, Safari 4+, Opera, Android etc.
jQuery.fn.paste = function (str) {
  'use strict'
  let prefocused = document.activeElement
  str += ''  // coerce into string
  this.each((_, el) => {
    let beg = el.selectionStart
    let val = el.value

    // Insert string & move caret.
    el.value = `${val.slice(0, beg)}${str}${val.slice(el.selectionEnd)}`
    el.selectionEnd = el.selectionStart = beg + str.length

    // Scroll content to caret (non-DOM, non-chainable).
    el.blur()
    el.focus()
  })
  prefocused.focus()
  return this
}

// Toggle fullscreen for one element or (with no arg) the whole window.
// [thewebflash.com/toggling-fullscreen-mode-using-the-html5-fullscreen-api]
function toggleFullscreen(elem) {
  'use strict'
  elem = elem || document.documentElement
  if (
    document.fullscreenElement
      || document.mozFullScreenElement
      || document.webkitFullscreenElement
      || document.msFullscreenElement
  ) {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  } else {
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen()
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
//
// Overlay module (for help text).
//
//   .hide() -- Hides currently open overlay.
//
(() => {
  'use strict'
  let $button = $('a[href="#help"]')
  let $overlay = $('.overlay.help')

  // Convert <tt> into links (except if they contain '…') by replacing
  // '<tt>…</tt>' with '<a class=tt href="#…">…</a>'.
  $overlay.find('tt').replaceWith(function () {
    let $el = $(this)
    let link = `#${$el.text().replace(/\s+/g, ' ')}`
    return link.match(/…/)
      ? this
      : $('<a>', { class: 'tt', href: link })
        .click(hideOverlay)
        .append($el.contents())
  })
  function hideOverlay() {
    $overlay.hide()
    $button.focus()
  }
  function showOverlay(e) {
    e.preventDefault()
    $overlay.show().find('>*').focus()
  }
  $button.click(showOverlay)
  $overlay.keyup(e => {
    if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) { return }
    if (e.key === 'Escape') {
      hideOverlay()
    }
  }).on('mouseover mouseout click', e => {
    // Only handle events from overlay border (not bubbled from within).
    if (e.target === $overlay[0]) {
      switch (e.type) {
      case 'mouseover':
        $overlay.addClass('hover')
        break
      case 'mouseout':
        $overlay.removeClass('hover')
        break
      case 'click':
        $overlay.hide()
      }
    }
  })
})()

////////////////////////////////////////////////////////////////////////////////
//
// URL fragment state module
// =========================
// Update URL fragment & trigger on URL fragment change.
//
// URL fragment syntax: {#|##}<query>[/<overlay>]
// ----------------------------------------------
//   * A single '#' (default) indicates that matches should be displayed with
//     videos, while '##' indicate a text only listing is desired.
//   * <query> is a search query (described elsewhere). Search query may
//     contain URL encdoded slashes.
//   * <overlay> (if specified) is the name of an overlay (to be displayed on
//     top of the page). Overlays are built into the HTML structure of the
//     page, but eventually there will be dynamic overlays for all the words of
//     the dictionary (in which case the <overlay> will be the 5-digit ID of
//     the word in question).
//
// Functions
// ---------
// .set(STATE) -- Change URL to reflect state (without triggering hooks).
// .onOverlayChange(FUNC) -- Register FUNC as callback for corresponding event.
// .onQueryChange(FUNC)
// .onVideoToggle(FUNC)
//
// Register FUNC as callback, called when corresponding part of the URL change.
//
// State
// -----
// The state object reflects the URL but the separators are removed, and all
// strings have been decoded. The 'video' value is javascript boolean.
//
//   {
//       base   : 'http://zrajm.github.io/teckentranskription/lexicon.html',
//       overlay: '',
//       query  : 'buss,taxi',
//       video  : true,
//   }
//
let urlFragment = (() => {
  'use strict'
  let state = { overlay: '', query: undefined, video: true }
  function getStateFromUrl() {
    let x = window.location.href
      .match(/^([^#]*)(?:(#*)([^#/]*)(?:\/([^#/]*))?)/u).slice(1)
    return {
      base:    x[0],
      overlay: decodeURIComponent(x[3] || ''),
      query:   decodeURIComponent(x[2]),
      video:   x[1].length === 0 || x[1] === '#',
    }
  }
  function setUrlFromState(state) {
    let str = encodeURIComponent(state.query)
      + (state.overlay ? ('/' + encodeURIComponent(state.overlay)) : '')
    if (str || state.video !== undefined) {
      str = (state.video ? '#' : '##') + str
    }
    return state.base + str
  }
  function getHashFromStr(hashStr) {
    let x = hashStr.split('/')
    let queryStr = x[0] || state.query
    let overlayStr = x[1]
    return (state.video ? '#' : '##')
      + encodeURIComponent(queryStr)
      + (overlayStr ? ('/' + encodeURIComponent(overlayStr)) : '')
  }
  // .set({ query: STR, video: BOOL, overlay: STR })
  // Update internal state + URL, without triggering hashchange event.
  function setState(partial) {
    let modified = false
    ;['overlay', 'query', 'video'].forEach(n => {
      if (partial[n] !== state[n] && partial[n] !== undefined) {
        state[n] = partial[n]
        modified = true
      }
    })
    if (modified) {  // update URL
      window.history.pushState({}, '', setUrlFromState(state))
      return true
    }
    return false
  }

  let hooks = {}
  function onOverlayChange(callback) { hooks.overlay = callback }
  function onQueryChange(callback) { hooks.query = callback }
  function onVideoToggle(callback) { hooks.video = callback }
  $(window).on('hashchange', () => {
    let newState = getStateFromUrl()
    let run = []
    ;['base', 'overlay', 'query', 'video'].forEach(n => {
      if (newState[n] !== state[n]) {       // save all state first
        if (hooks[n] instanceof Function) {
          run.push(n)                       //   register callback to run
        }
        state[n] = newState[n]              //   save state
      }
    })
    run.forEach(n => hooks[n](state[n]))    // run callbacks
  })

  // Trigger hashchange on initial page load.
  $(() => { $(window).trigger('hashchange') })

  return {
    set: setState,
    getHash: getHashFromStr,
    onOverlayChange: onOverlayChange,
    onQueryChange: onQueryChange,
    onVideoToggle: onVideoToggle,
  }
})()

////////////////////////////////////////////////////////////////////////////////

// Escape regex delimiter '/' or meta char.
function escape(x) {
  'use strict'
  return x.replace(/^[*+?^$.[\]{}()|/\\]$/u, '\\$&')
}

// Unquoted special characters: Expand unquoted char into character class.
let charClass = {
  'a': '[aàáâã]',
  'c': '[cç]',
  'e': '[eèéêë]',
  'i': '[iìíîï]',
  'n': '[nñ]',
  'o': '[oòóôõ]',
  'u': '[uùúûü]',
  'y': '[yýü]',
  'ä': '[äæ]',
  'ö': '[öø]',
  '􌤆': '[􌤆􌤂􌥞􌤀􌤃􌤄􌤅􌤾􌤈􌤇􌤉􌤋􌤊􌤼􌤌􌤛][􌤺􌥛􌤻􌤹􌥚]?', // face
  '􌤂': '[􌤂􌤀􌤃􌤄􌤅􌤾􌤈􌤇􌤉􌤋􌤊􌤼][􌤺􌥛􌤻􌤹􌥚]?',     // upper face
  '􌥞': '[􌥞􌤾􌤈􌤇􌤉􌤋􌤊􌤼􌤌􌤛][􌤺􌥛􌤻􌤹􌥚]?',       // lower face
  '􌥜': '[􌥜􌤑􌦲􌤒][􌤺􌥛􌤻􌤹􌥚]?',             // arm
  '􌤠': '[􌤠􌥀􌤡][􌤺􌥛􌤻􌤹􌥚]?',              // shoulders
  '􌤓': '[􌤓􌤕􌤔][􌤺􌥛􌤻􌤹􌥚]?',              // chest
  '􌤗': '[􌤗􌤙􌤘][􌤺􌥛􌤻􌤹􌥚]?',              // hips
  '*': '[^ 􌥠/.,:;?!()]*',  // all non-space, non-'/' delimiter
  // one place symbol (+ optional relation)
  '@': '(?:@|[􌦳􌤆􌤂􌥞􌤀􌤃􌤄􌤅􌤾􌤈􌤇􌤉􌤋􌤊􌤼􌤌􌤛􌤜􌤞􌤠􌥀􌤡􌥜􌤑􌦲􌤒􌤓􌤕􌤔􌤖􌤗􌤙􌤘􌤚][􌤺􌥛􌤻􌤹􌥚]?)',
  // one handshape symbol (+ optional relation)
  '#': '(?:#|[􌤤􌥄􌤣􌤧􌥋􌥉􌦫􌤩􌤎􌥇􌦬􌤦􌤲􌤱􌥑􌤢􌥂􌤪􌥎􌥈􌤨􌤿􌥌􌥆􌤫􌦭􌤬􌥅􌤥􌥊􌦱􌤽􌤯􌤭􌤮􌤰􌤳􌥃􌥒􌥟􌦪][􌤺􌥛􌤻􌤹􌥚]?)',
  '^': '[􌤺􌥛􌤻􌤹􌥚]',          // one relation symbol
  ':': '[􌥓􌥔􌤴􌥕􌤵􌥖][􌤶􌥗􌤷􌥘􌤸􌥙]', // one attitude symbol
  '􌦮': '(?:􌦮[􌦈􌥽􌦉􌥾􌦊􌦋􌥿􌦀􌦌􌦂􌦵]?|􌥰[􌥿􌦀􌦌])', // circle in frontal plane
  '􌦯': '(?:􌦯[􌦈􌥽􌦉􌥾􌦊􌦋􌥿􌦀􌦌􌦂􌦵]?|􌥰[􌦈􌥽􌦉])', // circle in horisontal plane
  '􌦰': '(?:􌦰[􌦈􌥽􌦉􌥾􌦊􌦋􌥿􌦀􌦌􌦂􌦵]?|􌥰[􌥾􌦊􌦋])', // circle in saggital plane
}
// Unquoted place/handshape symbols should also match a following
// (optional) relation symbol.
for (let c of '􌦳􌤀􌤃􌤄􌤅􌤾􌤈􌤇􌤉􌤋􌤊􌤼􌤌􌤛􌤜􌤞􌥀􌤡􌤑􌦲􌤒􌤕􌤔􌤖􌤙􌤘􌤚􌤤􌥄􌤣􌤧􌥋􌥉􌦫􌤩􌤎􌥇􌦬􌤦􌤲􌤱􌥑􌤢􌥂􌤪􌥎􌥈􌤨􌤿􌥌􌥆􌤫􌦭􌤬􌥅􌤥􌥊􌦱􌤽􌤯􌤭􌤮􌤰􌤳􌥃􌥒􌥟􌦪') {
  charClass[c] = `${c}[􌤺􌥛􌤻􌤹􌥚]?`
}
// All unquoted hand-external motion symbols (circling/bouncing/curving/
// hitting/twisting/divering/converging) should also match a following
// (optional) motion direction symbol.
for (let c of '􌥯􌦶􌥰􌥱􌥲􌥹􌦅') { charClass[c] = `${c}[􌦈􌥽􌦉􌥾􌦊􌦋􌥿􌦀􌦌􌦂􌦵]?` }

function finalizeTerm(state) {
  'use strict'
  let { plain = '', regex = '', not, field } = state
  const noWord = '[ 􌥠,:!?/.’()[\\]&+–]'
  const noWordBeg = RegExp(`^${noWord}`, 'ui')
  const noWordEnd = RegExp(`${noWord}$`, 'ui')
  return [
    regex
      ? RegExp(
        field
          ? `^${regex}$`                                        // whole field
          : ((plain.match(noWordBeg) ? '()' : `(^|${noWord})`)  // single word
            + `(${regex})`
            + (plain.match(noWordEnd) ? '' : `(?=${noWord}|$)`)),
        'ui')
      : null,
    plain, not,
  ]
}

// Parse user's query string, return QUERY object with following root methods:
//
// * hilite():        Return regex for highlighting matches in output.
// * search(ENTRIES): Return list entries matching query. ENTRIES is list where
//                    each entry is a list of fields; each field is a string.
//                    (ie a list-of-lists, but depth does not vary.)
//
// QUERY also contains a nested list of search terms (regexes with 'g' and 'y'
// flags UNSET, and the added property 'not'). Multiple terms are wrapped in
// (possibly nested) lists (with added properties 'not', 'or' and 'own'). Added
// properties indicate: 'not' = mark that item must NOT be be found to match;
// 'or' = subitems in list are OR:ed, rather than AND:ed; 'own' = list
// correspond to a parethesis entered in query by user (user-entered/explicit
// paretheses are removed if redundant, and implicit lists are added to
// disambiguate order of AND/OR precedence).
//
// Query parsing is sloppy = all input is valid (eg incomplete parentheses and
// quotes). Operator precedence is: NOT -> AND -> OR (`a, -b c` = `a, (-b c)`).
function parseQuery(queryStr) {
  'use strict'
  let query = (() => {
    function p(x) {
      return x.split(' ').reduce((a, p) => { a[p] = true; return a }, [])
    }
    function and_() { return p('') }
    function or_() { return p('or') }
    function or() { return p('or own') }
    function nor() { return p('or own not') }

    let q = [[]]  // query stack
    add(or_())
    add(and_())

    function add(x) {  // add new parenthesis
      q[q.length - 1].push(x)
      if (Array.isArray(x)) { q.push(x) }
    }
    function end() {   // end parenthesis
      let z = q.pop()          // pop last paren on stack
      let p = q[q.length - 1]  // parent paren
      // Cleanup: Remove empty parens, and parens around single terms.
      switch (z.length) {
      case 0:
        p.pop()
        break
      case 1:
        let [c] = z             // eslint-disable-line no-case-declarations
        c.own = c.own || z.own  // OR
        c.not = c.not ^ z.not   // XOR
        p[p.length - 1] = c
      }
      // Cleanup: Remove parens around children with same AND/OR as parent.
      z.forEach((c, i) => {
        // c.length is always >1 here (cleaned up above)
        //
        // Process children (c) of current parenthesis (z) here, since AND/OR
        // status of child's parent must be known. (The current parenthesis
        // will not have AND/OR set for first item, since comma/space which
        // specifies this comes AFTER first item in the query language.)
        if (Array.isArray(c) && (z.or === c.or && !c.not)) {
          z.splice(i, 1, ...c)
        }
      })
    }
    function wrap() {  // wrap query in extra paren
      if (Array.isArray(q[0])) {
        q[0].own = true
        q.unshift([q[0]])
        q.unshift([q[0]])
        q[0].or = true
        q.unshift([q[0]])
      }
    }
    function done() {
      while (q.length > 1) { end() }  // trim all remaining parens

      // FIXME: Why is this necessary? Can this be handled by end()?
      if (q[0].length === 1 && Array.isArray(q[0][0])) {
        let [z] = q
        let [c] = z
        c.own = c.own || z.own  // OR
        c.not = c.not ^ z.not   // XOR
        q[0] = c
      }
    }

    function addParen(not) {
      add(not ? nor() : or())
      add(and_())
    }
    function endParen() {
      while (q.length > 1 && !q[q.length - 1].own) { end() }  // trim all parens
      if (q.length === 1) { wrap() }
      end()
    }
    function orParen() {
      end()
      add(and_())
    }
    function addTerm(cb) {
      let [re, plain, not] = cb()
      if (re) { add(Object.assign(re, { not, plain })) }
      return this
    }
    // Test if single entry 'e' (list of strings) match query (<q>). Return
    // true on match, false otherwise.
    function searchEntry(q, e) {
      let x = Array.isArray(q)
        ? q[q.or ? 'some' : 'every'](q => searchEntry(q, e))  // subquery
        : e.some(f => q.test(f))                              // base case
      return q.not ? !x : x
    }
    function flat(q) {
      return q.reduce(
        (a, q) => a.concat(Array.isArray(q) ? flat(q) : q.source), [])
    }
    function get() {
      done()
      let x = q[q.length - 1]
      return Object.assign(x, {
        // NOTE: Keep negated terms in hilite() (since '-(-a,-b)' match 'a b').
        hilite: () => RegExp(flat(x).join('|'), 'gui'),
        search: e => x.length ? e.filter(e => searchEntry(x, e)) : [],
      })
    }
    return { addTerm, addParen, endParen, orParen, get }
  })()
  let fsa = {
    '(': s => { query.addTerm(() => finalizeTerm(s)).addParen(s.not) },
    ')': s => { query.addTerm(() => finalizeTerm(s)).endParen() },
    ',': s => { query.addTerm(() => finalizeTerm(s)).orParen() },
    ' ': s => { query.addTerm(() => finalizeTerm(s)) },
    '"': (s, c) => { s.quote = c; return s },
    "'": (s, c) => { s.quote = c; return s },
    'QUOTED': (s, c) => {
      if (c === s.quote) {
        delete s.quote
      } else {
        s.regex = (s.regex || '') + escape(c)
        s.plain = (s.plain || '') + c
      }
      return s
    },
    'UNQUOTED': (s, c) => {
      if (!s.regex) {            // before word
        if (c === '-') {         //  '-' negated
          s.not = s.not ^ true
          return s
        } else if (c === '=') {  //  '=' match whole field
          s.field = true
          return s
        }
      }
      s.regex = (s.regex || '') + (charClass[c] || escape(c))
      s.plain = (s.plain || '') + c
      return s
    },
  }
  let state = {} // contains: 'plain', 'regex', 'field', 'not' and 'quote'
  for (let c of queryStr.normalize()) {  // process char-by-char in FSA
    state = fsa[state.quote ? 'QUOTED' : fsa[c] ? c : 'UNQUOTED'](state, c) || {}
  }
  return query.addTerm(() => finalizeTerm(state)).get()
}

function hilite(str, regex, func) {
  'use strict'
  return str.replace(regex, (match, ...parts) => {
    parts = parts.slice(0, -2).filter(p => p !== undefined)
    if (func) {
      func()
    }
    // Lookbehind (?<=...) isn't supported in Safari (and was only added to
    // Edge and Firefox in summer 2020), therefore we use regex subgroups
    // instead.
    return '{0}<mark>{1}</mark>'.fmt(
      (parts.length === 2) ? parts : ['', match]
    )
  })
}

function htmlifyTags(tags, hiliteRegex) {
  'use strict'
  // Tag count starts at -1 to compensate for the tag counter (e.g. '/1').
  let count = { tag: -1, warn: 0 }
  let match = { tag: false, warn: false }
  if (tags.length === 1) {
    return ''
  }
  // Generate tag list and count matches, and number of tags/warnings.
  let html = tags.map(tag => {
    // Determine tag type (warning = add warning icon).
    let tagType = tag.match(/\/ovanligt/) ? 'warn' : 'tag'
    count[tagType] += 1
    return hilite(tag, hiliteRegex, () => {
      match[tagType] = true
    }).replace(/(^|[^<])\//g, '$1<span class=sep>/</span>')
      + (tagType === 'warn' ? ' <span class=sep>▲</span>' : '')
  })
  return '<span class=tags title="{tags}{help}">{icons}</span>'.fmt({
    tags: html.join('<br>'),
    help: ' <span class=sep>(antal taggar)</span>',
    icons: ['warn', 'tag'].map(tagType => {
      return count[tagType] === 0
        ? ''
        : '<img src="pic/{type}{match}.svg" alt="{alt}">'.fmt({
          type: tagType,
          match: match[tagType] ? '-marked' : '',
          alt: match[tagType] ? 'Ovanligt' : 'Taggar',
        })
    }).join(''),
  })
}

// Turn a (hilited) transcription string into HTML.
function htmlifyTranscription(hilitedTransStr) {
  'use strict'
  return hilitedTransStr
    // Insert <wbr> tag after all segment separators.
    .replace(/􌥠/gu, '􌥠<wbr>')
}

// Downcase string, remove all non-alphanumenic characters and space (by
// replacing Swedish chars with aao, and space with '-') and collapse all
// repetitions of '-'.
function unicodeTo7bit(str) {
  'use strict'
  return str.toLowerCase().replace(/[^a-z0-9-]/gu, m => ({
    ' ': '-', 'é': 'e', 'ü': 'u', 'å': 'a', 'ä': 'a', 'ö': 'o', '–': '-',
  }[m] || '')).replace(/-{2,}/, '-')
}

function htmlifyMatch(entry, hiliteRegex) {
  'use strict'
  let [id, transcr, ...rest] = entry
  let swe = rest.filter(x => x[0] !== '/')   // Swedish
  let tags = rest.filter(x => x[0] === '/')  // /tags
  return (
    /* NB: Whitespace below shows up in search result's 'text' mode. */
    '<div class=match>'
      + '<div class="video-container is-loading">'
        + '<img src="{baseUrl}/photos/{dir}/{file}-{id}-tecken.jpg"'
        + ' data-video="{baseUrl}/movies/{dir}/{file}-{id}-tecken.mp4" alt="">'
        + '<div class=video-feedback></div>'
        + '<div class=top-right style="text-align:right">'
          + '<a class=video-id href="{baseUrl}/ord/{id}"'
            + ' title="Öppna i Svenskt tecken­språks­lexikon (i ny tabb)"'
            + ' target=_blank rel="noopener">{htmlId}</a>\n'
          + '{htmlTags}\n'
        + '</div>'
        + '<div class=video-subs>'
          + '<a data-href="{transcr}" title="{htmlTranscr}">'
            + '{htmlTranscr}</a>'
        + '</div>'
      + '</div> '
      + '<span title="{htmlSwedish}">{htmlSwedish}</span>'
    + '</div>\n'
  ).fmt({
    htmlTags: htmlifyTags(tags, hiliteRegex),
    id: id,
    htmlId: hilite(id, hiliteRegex),
    baseUrl: 'https://teckensprakslexikon.su.se',
    dir: id.substring(0, 2),
    file: unicodeTo7bit(swe[0]),
    transcr: transcr,
    htmlTranscr: htmlifyTranscription(hilite(transcr, hiliteRegex)),
    htmlSwedish: swe.map(txt => hilite(txt, hiliteRegex)).join(', '),
  })
}

// A function that interatively displays the result of a search. `chunksize`
// items are displayed at a time, thereafter an additional `chunksize` items
// are shown if user scrolls to the end of the page or press the 'Show more…'
// button.
//
// If the function is invoked again with a new search result, then any still
// ongoing processing is aborted and only the new result is displayed.
let outputMatching = (() => {
  'use strict'
  let chunksize = 100  // setting (never changes)
  let hasListener = false
  let $status
  let $result
  let $button
  let htmlQueue
  let startSize
  let count

  function scrolledToBottom() {
    let pageOffset = window.pageYOffset || window.scrollY
    let pageHeight = document.body.offsetHeight
    let winHeight = window.innerHeight
    return (pageOffset + winHeight) >= (pageHeight - 2)
  }
  function outputNext(args) {
    if (args) {
      $status = args.status
      $result = args.result
      $button = args.button
      htmlQueue = args.html
      startSize = htmlQueue.length
      count = 0
    }
    // Output one chunk of search result.
    let chunk = htmlQueue.splice(0, chunksize)
    count += chunk.length
    if (count === startSize) {
      $status.html(`${count} träffar (visar alla)`)
    } else {
      $status.html(
        `${startSize} träffar (visar ${count}) – <a>Visa ${chunksize} till</a>`)
      $('>a', $status).click(() => { outputNext() })
    }

    $result.append(chunk.join(''))
    $result.imagesLoaded().progress(onImageLoad)

    if (htmlQueue.length === 0) {  // nothing more to display
      $button.hide()
      $(window).off('scroll')
    } else {                       // moar to display
      if (!hasListener) {
        $button.click(() => { outputNext() })
        hasListener = true
      }
      if (args) {
        $button.show()
        $(window).on('scroll', () => {
          if (scrolledToBottom()) {
            outputNext()
          }
        })
      }
    }
  }
  return outputNext
})()

function onImageLoad(imgLoad, image) {
  'use strict'
  // change class if image is loaded or broken
  let $parent = $(image.img).parent()
  $parent.removeClass('is-loading')
  if (!image.isLoaded) {
    $parent.addClass('is-broken')
  }
}

function searchLexicon(queryStr) {
  'use strict'
  let $body = $(document.body)

  $('#q').val(queryStr)
  // No query, add 'noquery' to body element.
  $body[queryStr ? 'removeClass' : 'addClass']('noquery')
  setTimeout(() => {
    let query = parseQuery(queryStr)
    let matches = query.search(lexicon)

    // Query without matches, add 'nomatch' to <body>.
    $body[(query.length && !matches.length) ? 'addClass' : 'removeClass']('nomatch')

    // Output search result.
    outputMatching({
      status: $('#search-count'),
      result: $('#search-result').empty(),
      button: $('#more'),
      html: matches.map(entry => htmlifyMatch(entry, query.hilite())),
    })
  }, 0)
}

function onPlayPauseToggle(event) {
  'use strict'
  if ($(event.target).closest('a').length) {  // link clicked: don't play
    return
  }
  let $container = $(event.currentTarget)
  let $video = $('>video,>img[data-video]', $container)

  if ($video.is('img')) {                     // replace <img> with <video>
    $video = $(
      '<video loop muted playsinline src="{0}" poster="{1}"></video>'
        .fmt([$video.data('video'), $video.attr('src')])
    ).replaceAll($video).on('canplay error', e => {
      $video.off('canplay error')
      $container.removeClass('is-loading-video is-broken')
      if (e.type === 'error') {
        $container.addClass('is-broken')
      }
    })
    $container.addClass('is-loading-video')
  }

  // Get state of video and toggle play/pause state.
  // (Everything that remains after this is visual feedback.)
  let action = $video.prop('paused') ? 'play' : 'pause'
  $video.trigger(action)

  // Add icon to feedback overlay & animate it.
  let $feedback = $('>.video-feedback', $container)
    .removeClass('anim pause play')
    .addClass(action)  // display play/pause icon
  setTimeout(() => {   // animate icon
    $feedback
      .addClass('anim')
      .one('transitionend', () => {
        $feedback.removeClass('anim pause play')
      })
  }, 10)
}

$('#search-result')
  .on('click', '.video-container', onPlayPauseToggle)
  .on('dblclick', '.video-container', event => {
    'use strict'
    toggleFullscreen($('>video', event.currentTarget)[0])
  })

// On window resize: Rescale #search-result element in steps.
{
  const $win = $(window)
  const $div = $('#search-result')
  const gapWidth = parseInt($div.css('word-spacing'), 10)
  const colWidth = 270  // same as .video-container in CSS
  let oldWidth
  let oldCols
  $win.on('load resize', () => {
    'use strict'
    const width = $win.width()
    if (width === oldWidth) {  // window width unchanged
      return
    }
    const cols = Math.floor((width + gapWidth) / (colWidth + gapWidth)) || 1
    if (cols === oldCols) {    // number of columns unchanged
      return
    }
    $div.css('width', (gapWidth * (cols - 1)) + (colWidth * cols))
    oldWidth = width
    oldCols = cols
  })
}

// Tooltips: These imitate Chromium tooltip behaviour, but allow us to use any
// font -- so that sign language transcriptions can be displayed.
(() => {
  'use strict'
  let $tooltip = $('<div class=tooltip></div>')
    .css({
      display: 'none',
      color: '#fff',
      background: '#555',
      borderRadius: 2,
      boxShadow: '0 2px 6px rgba(0, 0, 0, .25)',
      fontSize: 16,
      lineHeight: '1.6',
      padding: '.5em',
      position: 'fixed',
      zIndex: 2147483647, /* max allowed */
    })
    .appendTo(document.body)

  // Trigger event if pointer is non-moving for half a second.
  let timeout
  $(document.body).on('mouseover', '[title],[data-title]', event => {
    let $e = $(event.currentTarget)
    let value = $e.attr('title')

    // Change attribute 'title' => 'data-title' to suppress browser tooltip.
    if (value !== undefined) {
      $e.attr('data-title', value).removeAttr('title')
    }

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      if ($e.is(':visible') && $e.is(':hover')) {
        onMouseStill(event)
      }
    }, 500)
  })

  let shown = false
  function onMouseStill(event) {
    // Display topleft to get height + width.
    shown = true
    $tooltip
      .css({ left: 0, top: 0 })
      .html($(event.currentTarget).data('title'))
      .show()

    // Now use height and width of displayed tooltip, to move it to the
    // right place (making sure it doesn't stick out of right/bottom corner
    // of window).
    let xMax = $(window).width() - $tooltip.outerWidth()
    let yMax = $(window).height() - $tooltip.outerHeight()
    let x = event.clientX + 10  // mouse coord
    let y = event.clientY + 10
    $tooltip.css({
      left: x < xMax ? x : (xMax < 0 ? 0 : xMax),
      top:  y < yMax ? y : (yMax < 0 ? 0 : yMax),
    })
  }

  function hideTooltip() {
    if (shown) {
      shown = false
      $tooltip.hide()
    }
  }
  $(window).on('hashchange resize', hideTooltip)
  $(document).on('scroll mousemove mousedown keydown', hideTooltip)
})()

////////////////////////////////////////////////////////////////////////////////
//
// Main program
//

// URL update events, these are triggered when user follows a page internal
// link, when user manually edits URL, and on initial page load. These hooks
// update internal state to reflect URL change (without causing any additional
// changes to URL).
urlFragment.onQueryChange(searchLexicon)
urlFragment.onVideoToggle(showVideos)

// Form submission.
$(() => {
  'use strict'
  let $form = $('#search')
    .on('submit', onSubmit)
  let $q = $('#q')
    .on('focus blur', onFocus)
    .on('keydown', onKey)
    .on('paste', onPaste)
  onFocus()

  // Text input '#q' focused = set 'focused' class on wrapper element.
  function onFocus() {
    $form.toggleClass('focus', $q.is(':focus'))
  }
  // Return key in textarea = submit form.
  function onKey(e) {
    if (e.which === 13) {                 // Enter
      e.preventDefault()                  //   don't insert key
      if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
        return
      }
      $form.submit()
    }
  }
  // Form submission.
  function onSubmit(e) {
    let queryStr = $q.val() || ''
    e.preventDefault()                    // don't submit to server
    // On touchscreen devices (where no input type has hover).
    if (window.matchMedia('not all and (any-hover:hover)').matches) {
      $q.blur()  // hide soft keyboard
    }
    urlFragment.set({ query: queryStr }) && searchLexicon(queryStr)
  }
  // Paste in textarea = filter out newlines (use jQuery .paste plugin).
  function onPaste(e) {
    if ($q[0].selectionEnd === undefined) { // if unsupported: do nothing
      return
    }
    e.preventDefault()
    $q.paste(
      (
        window.clipboardData !== undefined
          ? window.clipboardData          // MSIE, Safari, Chrome
          : e.originalEvent.clipboardData // WebKit
      ).getData('text').replace(/[\n\r\u0020]+/g, ' ')
    ).trigger('input')
  }
});

// Update lexicon date in page footer.
(() => {
  'use strict'
  function updateLexiconDate() {
    if (lexiconDate === undefined) {
      setTimeout(updateLexiconDate, 250)
    } else {
      $('#lexicon-date').html(lexiconDate.toLocaleString(
        'sv', { year: 'numeric', month: 'long', day: 'numeric' }
      ))
      $('#lexicon-size').html(
        `${Object.keys(lexicon).length}`.replace(/(?=(\d{3})+$)/g, ' ')
      )
    }
  }
  $(updateLexiconDate)
})()

function showVideos(bool) {
  'use strict'
  $('#search-wrapper')
    .removeClass('video-view text-view')
    .addClass(bool ? 'video-view' : 'text-view')
}
$('#search-wrapper .selector').on('click keypress', e => {
  'use strict'
  if (e.type === 'keypress') {
    if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) { return }
    if (e.which !== 13 && e.which !== 32) { return }
  }
  let hasVideo = $('#search-wrapper')
    .toggleClass('video-view text-view')
    .hasClass('video-view')
  urlFragment.set({ video: hasVideo })
})

// Update 'href' attr when mouse enters <a data-href=…> tag (used to retain
// current video/text result setting). 'data-href' syntax: [query][/overlay]
$(() => {
  'use strict'
  // 'mouseenter' used here since it does not trigger when child elements are
  // entered, and the event does not bubble.
  $('#search-result').on('mouseenter', 'a[data-href]', e => {
    let $e = $(e.currentTarget)
    let hashref = $e.data('href') || ''
    if (hashref) {
      $e.attr('href', urlFragment.getHash(hashref))
    }
  })
})

//[eof]
