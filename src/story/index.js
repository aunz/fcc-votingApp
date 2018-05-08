import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import client from '~/client/apolloClient'

import '~/client/styles/index.css'

// import Story from '~/client/components/Header_story'
// import Story from '~/client/components/Button_story'
// import Story from '~/client/components/Poll_story'
// import Story from '~/client/components/LoginStatus_story'
// import Story from '~/client/components/Chart_story'
// import Story from '~/client/components/PollResult_story'
import Story from '~/client/components/NewPoll_story'
// import Story from '~/client/App'


render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <Story />
    </ApolloProvider>
  </BrowserRouter>
  , document.getElementById('root')
)

if (module.hot) module.hot.accept()
