import React, { Fragment, Component } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import Comp from './VoteResult'


const data1 = {
  q: 'Your favorite color',
  o: [
    { k: 'green', v: 11 },
    { k: 'yellow', v: 16 },
    { k: 'red', v: 7 },
  ],
  nVote: 34
}

const data2 = {
  q: 'Drinks',
  o: [
    { k: 'tea', v: 0 },
    { k: 'coffee', v: 0 },
  ],
  // nVote: 0
}

const data3 = {
  q: 'Foods',
  o: [
    { k: 'peanutpeanutpeanutspeanutpeanutpeanutpeanut peanutpeanutpeanut', v: 99 },
    { k: 'butter', v: 1 },
    { k: 'scone', v: 1 },
  ],
  nVote: 101
}

export default withRouter(class Story extends Component {
  render() {
    return (
      <Fragment>
        <div className="flex flex-wrap">
          <div className="m1 p1 border" style={{ width: '360px' }} >
            <Comp data={data1} { ...this.props } />
          </div>
          <div className="m1 p1 border" style={{ width: '360px' }} >
            <Comp data={data2} voted={data2.o[0].k} />
          </div>
          <div className="m1 p1 border" style={{ width: '360px' }} >
            <Comp data={data3} />
          </div>
        </div>
      </Fragment>
    )
  }
})

