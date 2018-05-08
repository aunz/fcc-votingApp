import readline from 'readline'
import puppeteer from 'puppeteer'
import test from 'tape'
import db from '~/server/db/sqlite'

import { authWithGitHub } from './OAuth'

import './db/createTable/createTable'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const s = { skip: true } // eslint-disable-line


// this actually hits the GitHub API so don't run often, otherwise it reaches max limit
test('Authen with GitHub', s, async t => {
  const code = await new Promise(function (res) {
    const client_id = require('~/share/constants').GH_CLIENT_ID
    rl.question(`https://github.com/login/oauth/authorize?client_id=${client_id} log in enter the code here: `, res)
  })

  console.log('Authenticating with GitHub...')
  const user = await authWithGitHub(code)
  t.equal([user.login, user.id].join(' '), 'aunz-t1 38344010', 'Can authen with GitHub with the correct code')

  t.end()
})

test('Authen with GitHub with error', s, async t => {
  const user = await authWithGitHub('wrong code').catch(e => e)
  t.ok(user instanceof Error, 'cannot authenticate when authorization code is wrong')

  const userTest = await authWithGitHub('test123')
  t.equal(userTest.id, 'test123', 'can create a user with code begin with test')
  t.end()
})

// this use headless browser, need localhost:3000, LoginStatus.test.js
// this also hit the github API, so use sparingly
test('pupetter: login with GitHub', s, async t => {
  require('~/server/entry')

  const browser = await puppeteer.launch({
    headless: true
  })
  const page = await browser.newPage()

  await page.goto('http://localhost:3000')
  await page.waitForSelector('#login')
  page.click('#login')
  await page.waitForNavigation()

  page.setBypassCSP(true)
  await page.content()
  await page.waitForSelector('#login_field')
  await page.type('#login_field', process.env.GH_TEST_USERNAME)
  await page.waitForSelector('#password')
  await page.type('#password', process.env.GH_TEST_PW)
  page.click('input[type=submit]')
  await page.waitForNavigation()

  // await page.screenshot({ path: 'example.png' })

  await page.waitForSelector('#loggedInUser')
  const element = await page.$eval('#loggedInUser', e => e.innerText)

  // await page.waitForNavigation({ waitUntil: 'networkidle2' })
  // await page.screenshot({ path: 'example2.png' })
  console.log('done', element)
  t.ok(/cat/i.test(element), 'can log in with GitHub')
  t.end()
})


// this test use pupetter too but doesn't hit the GitHub API
test('pupetter: login with token', async t => {
  console.time('Done')
  require('~/server/entry')

  const page = await puppeteer.launch({
    headless: false
  }).then(browser => browser.newPage())

  await page.goto('http://localhost:3000')
  await page.addScriptTag({
    path: 'node_modules/idb-keyval/dist/idb-keyval-iife.min.js'
  })
  await page.evaluateHandle(() => {
    return window.idbKeyval.set('csrfToken', '123')
  })
  console.log('csrfToken added')

  await page.goto('http://localhost:3000/?code=test123&state=123')
  await page.addScriptTag({
    path: 'node_modules/idb-keyval/dist/idb-keyval-iife.min.js'
  })

  const element = await page.$eval('#loggedInUser', e => e.innerText)
  t.ok(/Hi|Hello/i.test(element), 'Log in success: ' + element)
  
  const loggedInUser = await page.evaluateHandle(() => {
    return window.idbKeyval.get('loggedInUser')
  }).then(r => r.jsonValue())

  // try to update name
  const newName = 'new cat'
  db.prepare('update "user" set gh_name = ? where id = ?').run(newName, loggedInUser.id)

  await page.reload()
  await page.waitForSelector('#loggedInUser')
  await sleep()

  t.ok((new RegExp(newName)).test(
    await page.$eval('#loggedInUser', e => e.innerText)
  ), 'log in success with a new name: ' + newName)

  await page.click('#logout')
  await page.waitForNavigation()
  await page.addScriptTag({
    path: 'node_modules/idb-keyval/dist/idb-keyval-iife.min.js'
  })

  t.ok(/login.*GitHub/i.test(
    await page.$eval('#login', e => e.innerText)
  ), 'can log out')

  t.ok(undefined === (await page.evaluateHandle(() => {
    return window.idbKeyval.get('loggedInUser')
  }).then(r => r.jsonValue())), 'indexed is cleared after logging out')

  console.timeEnd('Done')
  t.end()
})

function sleep(duration = 3000) {
  return new Promise(r => setTimeout(r, duration))
}
