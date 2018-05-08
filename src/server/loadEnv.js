require('dotenv').config()
if (process.env.NODE_ENV === 'development') require('dotenv').config({ path: require('path').resolve('.env.dev') })
if (process.env.TEST) require('dotenv').config({ path: require('path').resolve('.env.test') })
