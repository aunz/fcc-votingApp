import '~/server/db/sqlite'
import { GraphQLError  } from 'graphql'
import { errInput } from '~/share/errors'
import { ApolloError, createError } from 'apollo-errors';

const f = createError('foo', {
  message: '11fffff'
})

export default {
  Query: {
    // votes: () => [{ id: '', q: 'd', nVote: 1, o: [] }]
    votes: () => {
      // const r = new GraphQLError('jaj')
      // r.data = '111'
      // r.params = '111'
      // console.log(r.params)
      // const r = new ApolloError({ data: 'daa', message: 'hhh'})
      // throw 123
      // throw 11111
      return [
      {
        id: '1223',
        q: '234324'
      }
    ]}
  },
}
