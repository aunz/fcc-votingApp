// comparing plain crypto vs jwt
import crypto from 'crypto'
import XXhash from 'xxhash'

import db from '~/server/db/sqlite'
// db.exec(require('~/server/db/createTable/dropTable.sql'))
// db.exec(require('~/server/db/createTable/createTable.sql'))
// require('~/server/db/createTable/randomData.test')


const jwtSign = require('jsonwebtoken').sign
const jwsSign = require('jws').sign
const jwaSign = require('jwa')('HS256').sign


const arr = Array.from({ length: 100 }).map(() => Math.random()).join('')
const secret = 'secret'
const rb = crypto.randomBytes(256)

// warm up
round()

// actualy testing
round(10000)
round(100000)
// round(100000)
// round(100000)
// round(100000)
// round(100000)
// round(100000)

/* conclusion
  nativeHmac is the fastest, 1.0
  jwa, 1.05
  encrypt, 1.38
  jws, 1.55
  database, 1.87
  jwt slowest, 2.5 compared to nativeHmac

  jus hashing is 
*/

console.log(nativeHmac())
// console.log(jwt())
// console.log(jws())
console.log(jwa())
// console.log(encrypt())
console.log(hash())
console.log(md5())
console.log(xxhash())
console.log(randomBytes())

function round(n) {
  bench(nativeHmac, n) // 338 ms (n = 10000), 25901 ms (n = 1000000)
  bench(jwt, n) // 852, 64848
  bench(jws, n) // 578, 40349
  bench(jwa, n) // 333, 27340
  bench(encrypt, n) // 458, 35703
  bench(dataBase, n) // 634, 61448
  bench(hash, n) // 252, 25950
  bench(md5, n) // 207, 18130
  bench(xxhash, n) // 224, 16700
  bench(randomBytes, n) // 61, 5550
  bench(hashB, n) // 54, 4832
  bench(md5B, n) // 49, 3980
  bench(xxhashB, n) // 12, 1280
  console.log()
}


function nativeHmac() {
  const stuff = JSON.stringify({
    header: { alg: 'HS256' },
    payload: arr,
  })
  return crypto.createHmac('sha256', secret)
    .update(stuff)
    .digest('base64')
}

function jwt() {
  return jwtSign({ arr }, secret)
}

function jws() {
  return jwsSign({
    header: { alg: 'HS256' },
    payload: arr,
    secret
  })
}

function jwa() {
  return jwaSign({
    header: { alg: 'HS256' },
    payload: arr,
  }, secret)
}

function encrypt() {
  const stuff = JSON.stringify({
    header: { alg: 'HS256' },
    payload: arr,
  })

  const c = crypto.createCipher('aes192', secret)
  return c.update(stuff, 'utf8', 'base64') + c.final('base64')
}

function dataBase() {
  return db.prepare('select * from "user" where id = ?').get(10000)
}

function hash() {
  const stuff = JSON.stringify({
    header: { alg: 'HS256' },
    payload: arr,
  })
  return crypto.createHash('sha256')
    .update(stuff)
    .digest('base64')
}

function md5() {
  const stuff = JSON.stringify({
    header: { alg: 'HS256' },
    payload: arr,
  })
  return crypto.createHash('md5')
    .update(stuff)
    .digest('base64')
}

function xxhash() {
  const stuff = JSON.stringify({
    header: { alg: 'HS256' },
    payload: arr,
  })
  return XXhash.hash64(Buffer.from(stuff), 0).toString('base64')
}


function randomBytes() {
  return crypto.randomBytes(32).toString('base64')
}

function hashB() { return crypto.createHash('sha256').update(rb).digest() }
function md5B() { return crypto.createHash('md5').update(rb).digest() }
function xxhashB() { return XXhash.hash64(rb, 0) }




function bench(fn, n = 1000) {
  console.time(fn.name)
  for (let i = 0; i++ < n;) fn()
  console.timeEnd(fn.name)
}

