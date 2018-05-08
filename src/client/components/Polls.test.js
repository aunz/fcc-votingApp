import React from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'

import client from '~/client/apolloClient'
import '~/client/styles/index.css'

import Story from '~/client/components/Polls'

render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Story />
    </BrowserRouter>
  </ApolloProvider>
  , document.getElementById('root')
)

// this is to be rendered in root for integration test