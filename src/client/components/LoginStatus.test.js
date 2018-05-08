import React from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import client from '~/client/apolloClient'

import '~/client/styles/index.css'

import Story from '~/client/components/LoginStatus'

render(
  <ApolloProvider client={client}>
    <Story />
  </ApolloProvider>
  , document.getElementById('root')
)

// this is to be rendered in root for integration test