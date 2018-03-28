import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router'

import VoteChart from './VoteChart'

import btn, { btnFlat } from '~/client/styles/btn'
import radio from '~/client/styles/radio'



const hr = <hr className="my2" style={{ border: '0.5px solid #ccc' }} />

class VoteResult extends Component {
  static propTypes = {
    data: PropTypes.shape({
      q: PropTypes.string, // question title
      o: PropTypes.arrayOf(PropTypes.shape({
        k: PropTypes.string, // key
        v: PropTypes.number, // value
      })),
      nVote: PropTypes.number
    }).isRequired,
    voted: PropTypes.string,
    onClick: PropTypes.func,
  }
  state = { selected: undefined, showResult: this.props.voted }
  render() {
    const { data: { q, o, nVote }, voted, onClick, match } = this.props
    const { selected, showResult } = this.state
    const labelClassName = 'm1 p1 flex items-center h3 break-word ' + (voted ? '' : ' pointer ')
    return (
      <Fragment>
        <h3 className="m2 center color1-d">{q}</h3>
        {hr}
        {o.map(({ k }) => (
          <label
            key={k}
            className={labelClassName}
          >
            <input
              type="radio"
              name="radio"
              className={radio}
              disabled={voted}
              onChange={() => { this.setState({ selected: k }) }}
            />
            <span>{k}</span>
            {k === voted && <span className="ml1 x-small color1-l">YOU VOTED</span>}
          </label>
        ))}
        {voted ?
          null :
          <button
            className={btn + ' mt2 mx-auto block '}
            disabled={typeof selected === 'undefined'}
            onClick={onClick}
          >
            <span className="h6 color-inherit pre">VOTE </span>
            <span className="color-inherit break-word">{selected}</span>
          </button>
        }
        {hr}
        {!nVote ?
          <span className="silver">No vote yet</span> :
          showResult ?
            <VoteChart data={o} /> :
            <button
              className={btnFlat + ' block mx-auto h5'}
              onClick={() => { this.setState({ showResult: true }) }}
            >
              SEE RESULT
            </button>
        }
        
      </Fragment>
    )
  }
}

export default withRouter(VoteResult)
