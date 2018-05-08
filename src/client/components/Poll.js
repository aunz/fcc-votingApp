import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

export default class extends Component {
  static propTypes = {
    id: PropTypes.string,
    q: PropTypes.string,
    nVote: PropTypes.number,
  }
  shouldComponentUpdate() { return false }
  render() {
    const {
      id, q, nVote,
      ...rest
    } = this.props
    return (
      <Link
        className="flex m1 p2 justify text-decoration-none border border-color1"
        to={'/polls/' + (+id).toString(36)}
        {...rest}
      >
        <span className="mr-auto pr2 self-center break-word">
          {q}
        </span>
        <div className="flex flex-column items-center">
          <small>{nVote}</small>
          <span className="x-small silver">voted</span>
        </div>
      </Link>
    )
  }
}
