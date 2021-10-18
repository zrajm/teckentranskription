/* -*- js-indent-level: 2 -*- */
/* global QUnit:readonly, parseQuery:readonly */
/* exported dumpQuery */
/* eslint-disable space-in-parens, no-multi-spaces */

// Dumps a query object. Output explicit parentheses as `(…)`, and implicit
// ones as `[…]` (explicit = user specified in query, implicit = result of
// operator precedence; explicit parens have truthy `own` property).
function dumpQuery(q) {
  'use strict'
  return `${q.not ? '-' : ''}` + (
    Array.isArray(q)
      ? (
        (q.own ? '(' : '[')
          + (q.map(dumpQuery).join(q.or ? ', ' : ' '))
          + (q.own ? ')' : ']')
      ) : `${q.plain}`)
}

QUnit.module('queryParse', () => {
  'use strict'
  QUnit.test('Simplest tests', assert => {
    assert.equal(dumpQuery(parseQuery(  'a'   )),    '[a]',      "'a' ⇒ '[a]'")
    assert.equal(dumpQuery(parseQuery( '-a'   )),   '[-a]',     "'-a' ⇒ '[-a]'")
    assert.equal(dumpQuery(parseQuery(  'a b' )),  '[a b]',    "'a b' ⇒ '[a b]'")
    assert.equal(dumpQuery(parseQuery( '(a b)')),  '(a b)',  "'(a b)' ⇒ '(a b)'")
    assert.equal(dumpQuery(parseQuery('-(a b)')), '-(a b)', "'-(a b)' ⇒ '-(a b)'")
  })
  QUnit.test('Missing start parenthesis', assert => {
    // FIXME: next test should be '(a)'
    assert.equal(dumpQuery(parseQuery('a   )   '    )), '[a]',                         "'a)' ⇒ '[a]'")
    assert.equal(dumpQuery(parseQuery('a  b)   '    )), '(a b)',                   "'a b)' ⇒ '(a b)'")
    assert.equal(dumpQuery(parseQuery('a  b)  c'    )), '[a b c]',               "'a b) c' ⇒ '[(a b) c']")
    assert.equal(dumpQuery(parseQuery('a, b)  c'    )), '[(a, b) c]',           "'a, b) c' ⇒ '[(a, b) c']")
    assert.equal(dumpQuery(parseQuery('a  b), c'    )), '[(a b), c]',           "'a b), c' ⇒ '[(a b), c']")
    assert.equal(dumpQuery(parseQuery('a, b), c'    )), '[a, b, c]',           "'a, b), c' ⇒ '[a, b, c']")
    assert.equal(dumpQuery(parseQuery('a, b), c  d' )), '[a, b, [c d]]',     "'a, b), c d' ⇒ '[a, b, [c d]]'")
    assert.equal(dumpQuery(parseQuery('a, b) (c, d)')), '[(a, b) (c, d)]', "'a, b) (c, d)' ⇒ '[(a, b) (c, d)]'")
  })
  QUnit.test('Missing end parenthesis', assert => {
    assert.equal(dumpQuery(parseQuery('(a' )), '[a]',  "'(a' ⇒ 'a'")
    assert.equal(dumpQuery(parseQuery('(a b)' )), '(a b)',  "'(a b)' ⇒ '(a b)'")
    assert.equal(dumpQuery(parseQuery( 'a (b c' )), '[a b c]',  "'a (b c' ⇒ '[a b c]'")
    assert.equal(dumpQuery(parseQuery( 'a, (b c' )), '[a, (b c)]',  "'a, (b c' ⇒ '[a, (b) c)]'")
    assert.equal(dumpQuery(parseQuery( 'a (b, c' )), '[a (b, c)]',  "'a (b, c' ⇒ '[a (b, c)]'")
    assert.equal(dumpQuery(parseQuery( 'a, (b, c' )), '[a, b, c]',  "'a, (b, c' ⇒ '[a, b, c]'")
    assert.equal(dumpQuery(parseQuery(' a  b, (c, d' )), '[[a b], c, d]',     "'a b, (c, d' ⇒ '[[a b], c, d]'")
    assert.equal(dumpQuery(parseQuery('(a, b) (c, d')), '[(a, b) (c, d)]', "'(a, b) (c, d' ⇒ '[(a, b) (c, d)]'")
  })
  QUnit.test('Explicit parens', assert => {
    assert.equal(dumpQuery(parseQuery('a, b) c' )), '[(a, b) c]',  "'a, b) c' ⇒ '(a, b) c'")
    assert.equal(dumpQuery(parseQuery('a, b c'  )), '[a, [b c]]',   "'a, b c' ⇒ 'a, [b c]'")
    assert.equal(dumpQuery(parseQuery('a b, c'  )), '[[a b], c]',   "'a b, c' ⇒ '[a b], c")
    assert.equal(dumpQuery(parseQuery('(a b), c')), '[(a b), c]', "'(a b), c' ⇒ '(a b), c")
    assert.equal(dumpQuery(parseQuery('(a, b) c')), '[(a, b) c]', "'(a, b) c' ⇒ '(a, b) c")
  })
  QUnit.test('Implicit parens', assert => {
    assert.equal(dumpQuery(parseQuery('a b, c'           )), '[[a b], c]',                       "'a b, c' ⇒ '[[a b], c]'")
    assert.equal(dumpQuery(parseQuery('a, b c'           )), '[a, [b c]]',                       "'a, b c' ⇒ '[a, [b c]]'")
    assert.equal(dumpQuery(parseQuery('a b c, d'         )), '[[a b c], d]',                   "'a b c, d' ⇒ '[[a b c], d]'")
    assert.equal(dumpQuery(parseQuery('a, b c d'         )), '[a, [b c d]]',                   "'a, b c d' ⇒ '[a, [b c d]]'")
    assert.equal(dumpQuery(parseQuery('a b, c d'         )), '[[a b], [c d]]',                 "'a b, c d' ⇒ '[[a b], [c d]]'")
    assert.equal(dumpQuery(parseQuery('a b c, d e f'     )), '[[a b c], [d e f]]',         "'a b c, d e f' ⇒ '[[a b c], [d e f]]'")
    assert.equal(dumpQuery(parseQuery('a, b c, d'        )), '[a, [b c], d]',                 "'a, b c, d' ⇒ '[a, [b c], d]'")
    assert.equal(dumpQuery(parseQuery('a b, c d e, f g'  )), '[[a b], [c d e], [f g]]', "'a b, c d e, f g' ⇒ '[[a b], [c d e], [f g]]'")
    assert.equal(dumpQuery(parseQuery('a b, c'           )), '[[a b], c]',                       "'a b, c' ⇒ '[[a b], c]'")
    assert.equal(dumpQuery(parseQuery('((a, b c) e, f)'  )), '([(a, [b c]) e], f)', "'((a, b c) e, f)' ⇒ '([(a, [b c]) e], f)'")
    assert.equal(dumpQuery(parseQuery('((a b, c), e f)'  )), '([a b], c, [e f])', "'((a b, c), e f)' ⇒ '([a b], c, [e f])'")
  })
  QUnit.test('Single item in parenthesis', assert => {
    assert.equal(dumpQuery(parseQuery(     'a' )),   '[a]', "'a' ⇒ '[a]'")
    assert.equal(dumpQuery(parseQuery(    '-a' )),  '[-a]', "'-a' ⇒ '[-a]'")
    assert.equal(dumpQuery(parseQuery(   '--a' )),   '[a]', "'--a' ⇒ '[a]'")
    assert.equal(dumpQuery(parseQuery(  '---a' )),  '[-a]', "'---a' ⇒ '[-a]'")
    assert.equal(dumpQuery(parseQuery(    '(a)')),   '[a]', "'(a)' ⇒ '[a]'")
    assert.equal(dumpQuery(parseQuery(   '(-a)')),  '[-a]', "'(-a)' ⇒ '[-a]'")
    assert.equal(dumpQuery(parseQuery(   '-(a)')),  '[-a]', "'-(a)' ⇒ '[-a]'")
    assert.equal(dumpQuery(parseQuery(  '-(-a)')),   '[a]', "'-(-a)' ⇒ '[a]'")
    assert.equal(dumpQuery(parseQuery( '(-(-a))')),  '[a]', "'(-(-a))' ⇒ '[a]'")
    assert.equal(dumpQuery(parseQuery('-(-(-a))')), '[-a]', "'-(-(-a))' ⇒ '[-a]'")
  })
  QUnit.test('Removal of empty paren', assert => {
    assert.equal(dumpQuery(parseQuery('a () b ')), '[a b]', "'a  () b' ⇒ '[a b]'")
    assert.equal(dumpQuery(parseQuery('a -() b')), '[a b]', "'a -() b' ⇒ '[a b]'")
  })
  QUnit.test('Leading space or comma should not affect paren', assert => {
    assert.equal(dumpQuery(parseQuery('(,a b)')), '(a b)',  "'(,a b)' ⇒ '(a b)'")
    assert.equal(dumpQuery(parseQuery('( a,b)')), '(a, b)', "'( a,b)' ⇒ '(a, b)'")
  })
  QUnit.test('Unwrapping of parenthesis with same AND/OR as parent', assert => {
    assert.equal(dumpQuery(parseQuery('(a  b)  c' )), '[a b c]',     "'(a b) c' ⇒ '[a b c]'")
    assert.equal(dumpQuery(parseQuery( 'a (b   c)')), '[a b c]',     "'a (b c)' ⇒ '[a b c]'")
    assert.equal(dumpQuery(parseQuery('(a, b), c' )), '[a, b, c]', "'(a, b), c' ⇒ '[a, b, c]'")
  })
})

/*[eof]*/
