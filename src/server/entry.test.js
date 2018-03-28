// import './entry'



// import '~/share/cleanUserInput.test'
import './db/createTable/index.test'


// const typeDefs = `
// type T {
//   id: Int!
//   s: String
//   f: Float,
//   subT: T
// }

// type Query {
//   t(id: Int!, s: String, f: Float, a: [String]): T
// }

// `

// const resolvers = {
//   Query: {
//     t(_, args) {
//       console.log('The args', args)
//       return {
//         id: ~~(Math.random() * 1000000),
//         s: 'string',
//         f: 1.1,
//         // T: { a: 1 }
//       }
//     }
//   },
//   T: {
//     // s() { return 'ssss' },
//     subT(_, args) {
//       // console.log('The T args', args, 'ori', _)
//       // throw new Error('ajkah')
//       // throw new GraphQLError('aha')
//       return {
//         id: 1111,
//         s: 'String T',
//         f: '1.111'
//       }
      
//     }
//   }
// }

// import { makeExecutableSchema } from 'graphql-tools'
// import { graphql, GraphQLError  } from 'graphql'

// const schema = makeExecutableSchema({
//   typeDefs,
//   resolvers,
// })

// const query = `
// query kkk {
//   t(id: 1, a: ["Asdf", "sdf"]) { id, s, subT { f, l } }
// }
// `

// graphql(schema, query).then(r => {
//   console.log('\nthe result\n', r.errors)
//   if (r.errors) {
//     console.log(r.errors.code)
//   }
//   if (r.data && r.data.t) console.log(r.data.t)
// }).catch(e => {
//   console.log('typeof', typeof e)
//   console.log('\nthe error\n', e)
// })


