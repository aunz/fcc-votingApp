import React, { Fragment, Component } from 'react'
import Comp from './Chart'

export default class Story extends Component {
  state = {
    data: [
      { k: 'green', v: 15 },
      { k: 'yellow', v: 5 },
      { k: 'red', v: 10 },
      { k: 'papayawhip', v: 20 },
    ]
  }
  componentDidMount() {
    // return
    setTimeout(() => {
      this.setState({
        data: [
          { k: 'yellow', v: 25 },
          { k: 'blue', v: 15 },
          { k: 'green', v: 20 },
          { k: 'red', v: 15 },
          { k: 'pink', v: 5 },
          { k: 'papayawhip', v: 15 },
        ]
      })
      // return
      setTimeout(() => {
        this.setState({
          data: [
            { k: 'yellow', v: 20 },
            { k: 'green', v: 20 },
            { k: 'red', v: 20 },
            // { k: 'papayawhip', v: 0 },
          ]
        })

        setTimeout(() => {
          this.setState({
            data: [
              { k: 'yellow', v: 20 },
              { k: 'green', v: 5 },
              { k: 'red', v: 10 },
              // { k: 'papayawhip', v: 0 },
            ]
          })

          setTimeout(() => {
            this.setState({
              data: [
                { k: 'yellow', v: 20 },
                { k: 'green', v: 20 },
                { k: 'redlllllllllllllllllllllllllllllllllllkwwwwwwwwwwwwwwwwww', v: 20 },
                // { k: 'papayawhip', v: 0 },
              ]
            })
          }, 1000)
        }, 1000)
      }, 1000)
    }, 1000)
  }
  render() {
    return (
      <Fragment>
        <div>Some title</div>
        <Comp
          data={this.state.data}
        />
      </Fragment>
    )
  }
}
