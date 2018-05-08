import test from 'tape'
import { graphql, buildSchema } from 'graphql'


import { schema } from './index'
import db from '~/server/db/sqlite'

db.exec(require('~/server/db/createTable/dropTable.sql'))
db.exec(require('~/server/db/createTable/createTable.sql'))
require('~/server/db/createTable/randomData.test')


// graphql(schema, query).then(r => console.log(r))
// .catch(e => console.error('\n\nERROR\n\n', e))

const s = { skip: true } // eslint-disable-line

test('getPolls', s, async function (t) {
  {
    const query = '{ getPolls { id, uid, ts, q, o } }'
    const r = (await graphql(schema, query)).data.getPolls
    t.equal([
      r.length,
      Object.keys(r[0]).join('.'),
      JSON.parse(r[0].o).length,
      Object.keys(JSON.parse(r[0].o)[0]).join('.'),
    ].join('_'), '25_id.uid.ts.q.o_2_k.v', 'can get polls, with correct length & fields: id, uid, ts, q, o')
  }

  t.equal([
    (await graphql(schema, '{ getPolls (lim: 100) { id } }')).data.getPolls.length,
    (await graphql(schema, '{ getPolls (lim: -100) { id } }')).data.getPolls.length,
    (await graphql(schema, '{ getPolls (lastId: 99999) { id } }')).data.getPolls.length,
  ].join('_'), '25_1_0', 'can set args for getPolls')

  t.end()
})


test('createPoll', s, async function (t) {
  const context = {
    req: {}
  }
  const r = (await graphql(
    schema,
    'mutation { createPoll(q: " q1   ", o: ["A   ", "B  ", "  A"]) }',
    undefined,
    context
  ))
  console.log(r)
  t.end()
})


// console.log(buildSchema('type Query { hello: String}'))