import express from 'express'
import graphqlExpress from './graphql'

const app = express()

app.disable('x-powered-by')
app.set('trust proxy', 'loopback')
app.use(express.static('./dist/public'))

app.use('/graphql', graphqlExpress)
if (process.env.NODE_ENV === 'development') {
  const { graphiqlExpress } = require('apollo-server-express')
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
}

app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    res.sendFile('index.html', { root: './dist/public' }, e => e && next())
  } else next()
})

app.listen(process.env.PORT || 3000, process.env.HOST, function () {
  console.log(`************************************************************
Express app listening at http://${this.address().address}:${this.address().port}
NODE_ENV: ${process.env.NODE_ENV}
process.pid: ${process.pid}
root: ${require('path').resolve()}
'************************************************************`)
})

export default app
