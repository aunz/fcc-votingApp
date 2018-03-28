import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'


import '~/client/styles/index.css'

// import Story from '~/client/components/Header_story'
// import Story from '~/client/components/Button_story'
import Story from '~/client/components/VoteCard_story'
// import Story from '~/client/components/VoteChart_story'
// import Story from '~/client/components/VoteResult_story'
// import Story from '~/client/App'


render(
  <BrowserRouter
    basebame="/24/"
  >
    <Story />
  </BrowserRouter>
  , document.getElementById('root')
)

module.hot && module.hot.accept()
