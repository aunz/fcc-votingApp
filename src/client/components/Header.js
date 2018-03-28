import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Header extends Component {
  shouldComponentUpdate() { return false }
  render() {
    return (
      <header
        className="center p3 bg-color1 white"
        { ...this.props }
      >
        <h1 className="m0 color-inherit">
          Voting App
        </h1>
        <h5 className="m0 h6 color-inherit">― part of FreeCodeCamp's Back End Projects</h5>
      </header>
    )
  }
}
