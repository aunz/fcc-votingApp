import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

class VoteCard extends Component {
  static propTypes = {
    id: PropTypes.string,
    q: PropTypes.string,
    nVote: PropTypes.number,
  }
  shouldComponentUpdate() { return false }
  render() {
    const {
      id, q, nVote,
      match: { url }, location, history, staticContext,  // eslint-disable-line
      ...rest
    } = this.props
    return (
      <Link
        className="flex p2 justify text-decoration-none border border-color1"
        to={url + 'votes/' + id}
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

export default withRouter(VoteCard)
