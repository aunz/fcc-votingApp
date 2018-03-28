import { graphqlExpress } from 'apollo-server-express'
import bodyParser from 'body-parser'
import { makeExecutableSchema } from 'graphql-tools'

import typeDefs from './typeDefs.gql'
import resolvers from './resolvers'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default [
  bodyParser.json(),
  graphqlExpress(function (req, res) {
    return {
      schema,
      context: { req },
      formatError(e) {
        // console.log('\n\nori err', e.originalError, '\n\n')
        // console.log('the e', Object.getOwnPropertyNames(e), e.statusCode, e)

        // if (process.env.NODE_ENV === 'production') {
          // Reflect.deleteProperty(e, 'locations')
          // e.locations = null
          // delete e.paths
        // }
        return e
      }
    }
  })
]