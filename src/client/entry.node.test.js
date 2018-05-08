// import axios from 'axios'
// import { inspect } from 'util'

// axios({
//   url: 'http://localhost:3000/graphql',
//   headers: {
//     d: 1
//   }
// }).then(r => {
//   // console.log(r.request)
// }).catch(e => {
//   // console.log('\n\nERROR', inspect(e.response, { depth: 1, colors: true }))
// })

import ApolloClient from 'apollo-boost'
import fetch from 'node-fetch'
import gql from 'graphql-tag'

global.fetch = fetch

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  ssrMode: true,
})

// client.query({
//   query: gql`query { getPolls { id } }`
// }).then(data => console.log({ data }))
//   .catch(e => console.log(e))

import React from 'react'
import ReactDOMServer from 'react-dom/server'

import { ApolloProvider, Query } from 'react-apollo'

function Q() {
  // return <div>124</div>
  return (
    <Query query={gql`query { getPolls {id}}`}>
      {(...args) => {
        console.log(...args)
        return null
      }}
    </Query>
  )
}

// console.log(client)

console.log(ReactDOMServer.renderToStaticMarkup(<ApolloProvider client={client}><Q /></ApolloProvider>))
