import React, { Fragment, Component } from 'react'
// import Comp from './Button'

import btn, { btnFlat } from '~/client/styles/btn'

export default class Header_story extends Component {
  render() {
    return (
      <Fragment>
        <div className="p3">
          <button className={btn}>11</button>
          <br /><br />
          <button className={btn}>好好吃</button>
          <br /><br />
          <button className={btn}><span>😎😗☺🥗🍙</span></button>
          <br /><br />
          <button className={btn} disabled>11</button>
          <br /><br />
          <button className={btn}>{Array.from({ length: 10 }).fill('W').join('')}</button>
          <br /><br />
          <button className={btnFlat}>FLAT</button>
          <br /><br />
          <button className={btnFlat}>好好吃</button>
          <br /><br />
          <button className={btnFlat}><span>😎😗☺🥗🍙</span></button>
          <br /><br />
          <button className={btnFlat} disabled>FLAT</button>
        </div>
      </Fragment>
    )
  }
}
