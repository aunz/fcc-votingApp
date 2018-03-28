import React, { Fragment, Component } from 'react'
import Comp from './Header'

export default class Story extends Component {
  render() {
    return (
      <Fragment>
        <Comp />
        <br />
        <Comp style={{ backgroundColor: '#39CCCC' }}/>
        <br />
        <Comp style={{ backgroundColor: '#7FDBFF' }}/>
        <br />
        <Comp style={{ backgroundColor: '#0074D9' }}/>
      </Fragment>
    )
  }
}
