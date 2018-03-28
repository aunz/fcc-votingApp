import test from 'tape'
import {
  cleanUserObject,
  cleanPollObject,
} from '~/share/cleanUserInput'


const s = { skip: true }

test('cleanUserObject', function (t) {
  t.deepEqual(
    cleanUserObject({}),
    {},
    'empty {}'
  )

  const o = { name: '1', email: 'hello@world', fb: '2', gg: '3' }
  t.deepEqual(
    cleanUserObject({ name: '   1   ', fb: ' 2 ', gg: ' 3 ', email: '       hello@world    ' }),
    o,
    'White space are trimmed: ' + JSON.stringify(o)
  )

  t.deepEqual(
    cleanUserObject({ name: '   1   ', fb: 2, gg: '', ttt: '1111' }),
    { name: '1' },
    'Number, empty string, and non-allowed keys are removed: { name: 1 }'
  )

  t.end()
})


test('cleanPollObject', s, function (t) {
  const e = { q: 'q', o: JSON.stringify({ 1: 0, 2: 0 }) } // expected
  t.deepEqual(
    cleanPollObject({ q: 'q', o: ['1', '2'] }),
    e,
    'All good with nice input'
  )

  // t.deepEqual(
  //   cleanPollObject({ q: '       q        ', o: ['1', '2     ', '    ', 3, {}, []], z: '111' }),
  //   e,
  //   'White space are trimmed, empty string, non-string, non-key are removed: ' + JSON.stringify(e)
  // )

  // t.ok(cleanPollObject({}) instanceof Error, /Invalid input/, 'Throw when object is missing')
  // t.ok(cleanPollObject({ o: ['1', '2'] }) instanceof Error, 'Throw when q is missing')
  // t.ok(cleanPollObject({ q: '   ', o: ['1', '2'] }) instanceof Error, 'Throw when q is empty')
  // t.ok(cleanPollObject({ q: 123, o: ['1', '2'] }) instanceof Error, 'Throw when q is not string')

  // t.ok(cleanPollObject({ q: 'q' }) instanceof Error, 'Throw when o is missing')
  // t.ok(cleanPollObject({ q: 'q', o: '1' }) instanceof Error, 'Throw when o is string')
  // t.ok(cleanPollObject({ q: 'q', o: 123 }) instanceof Error, 'Throw when o is number')
  // t.ok(cleanPollObject({ q: 'q', o: {} }) instanceof Error, 'Throw when o is {}')
  // t.ok(cleanPollObject({ q: 'q', o: [] }) instanceof Error, 'Throw when o is []')
  // t.ok(cleanPollObject({ q: 'q', o: [1, 2, 3] }) instanceof Error, 'Throw when o is [Number]')
  // t.ok(cleanPollObject({ q: 'q', o: ['1', '1', '1', 2, 3] }) instanceof Error, 'Throw when o is [] of 1 string element')

  t.end()
})

