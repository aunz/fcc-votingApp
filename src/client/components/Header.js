import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Header extends Component {
  shouldComponentUpdate() { return false }
  render() {
    return (
      <Link to="/" className="text-decoration-none">
        <header
          className="p2 bg-color1 white"
          {...this.props}
        >
          <h2 className="m0 color-inherit">Voting App</h2>
          <h5 className="m0 h6 color-inherit">― part of FreeCodeCamp's Back End Projects</h5>
        </header>
      </Link>
    )
  }
}
