import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'

export default new ApolloClient({
  clientState: {
    resolvers: {
      Query: {
        checkedLoggedInUser() {
          return 1111
        }
      },
      Poll: {
        _o(parent, args, { cache }) {
          parent._o = JSON.parse(parent.o)
          setTimeout(function () { // remove the o string
            cache.writeFragment({
              id: 'Poll:' + parent.id,
              fragment: gql`fragment o on Poll { o }`,
              data: { o: null, __typename: 'Poll' }
            })
          })

          return parent._o
        },
        nVote(parent) {
          return parent._o.reduce((p, n) => { return p + n.v }, 0)
        }
      },

    },
  },
  cacheRedirects: {
    Query: {
      getPoll(_, { id }, { getCacheKey }) {
        return getCacheKey({ __typename: 'Poll', id })
      }
    }
  }
})
