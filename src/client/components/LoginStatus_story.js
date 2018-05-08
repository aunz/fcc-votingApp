import { parse, stringify } from 'querystring'
import React, { Fragment, Component } from 'react'
import Comp from './LoginStatus'

export default class Story extends Component {
  render() {
    return (
      <Fragment>
        <div className="p1">
          <Comp />
        </div>
        <div className="p1">
          <Comp testParams={{ loading: true }} />
        </div>
        <div className="p1">
          <Comp testParams={{ error: 'Login failed' }} />
        </div>
        <div className="p1">
          <Comp testParams={{ loggedInUser: { name: '' } }} />
        </div>
        <div className="p1">
          <Comp testParams={{ loggedInUser: { name: 'King' } }} />
        </div>
        <div className="p1">
          <Comp testParams={{ loggedInUser: { name: 'Queen' } }} />
        </div>
      </Fragment>
    )
  }
}
