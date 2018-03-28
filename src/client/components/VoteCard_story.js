import React, { Fragment, Component } from 'react'
import Comp from './VoteCard'

export default class Story extends Component {
  render() {
    const longString = new Array(15).fill('Long long da 漫長的 dài dài 長く長い').toString()
    return (
      <Fragment>
        <div className="p1">
          <Comp q="Hi" nVote={1} />
        </div>
        <div className="p1">
          <Comp id="{1?*}" q="很" nVote={2} />
        </div>
        <Comp id="udm" q="😜 😜 😜" nVote={3} />
        <br />
        <Comp id="2kljdf" q="No nVote" nVote={0} />
        <br />
        <Comp id="90xsa" q={longString} nVote={456789} style={{ padding: '1rem' }} />
        <br />
        <Comp id="/" q="mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm" nVote={4} />
      </Fragment>
    )
  }
}
