import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import Query from 'react-apollo/Query'
import gql from 'graphql-tag'


import Chart from './Chart'
import { radio, btn, btnFlat, btnSmall, textInput } from '~/client/styles/styles'


const hr = <hr className="my2" style={{ border: '0.5px solid #ccc' }} />

export class PollResult extends Component {
  static propTypes = {
    data: PropTypes.shape({
      q: PropTypes.string, // question title
      _o: PropTypes.arrayOf(PropTypes.shape({
        k: PropTypes.string, // key
        v: PropTypes.number, // value
      })),
      nVote: PropTypes.number
    }).isRequired,
    voted: PropTypes.string,
    vote: PropTypes.func,
    addKey: PropTypes.func,
    loggedIn: PropTypes.bool,
  }
  state = {
    selected: undefined,
    showResult: this.props.voted,
    newKey: '',
  }
  render() {
    const { data: { q, _o, nVote }, voted, vote, addKey, loggedIn } = this.props
    const { selected, showResult, newKey } = this.state
    const labelClassName = 'm1 p1 flex items-center h3 break-word ' + (voted ? '' : ' pointer ')
    const newKeyTrimmed = newKey.trim()
    return (
      <Fragment>
        <h3 className="m2 center color1-d">{q}</h3>
        {hr}
        {_o.map(({ k }) => (
          <label
            key={k}
            className={labelClassName}
          >
            <input
              type="radio"
              name="radio"
              className={radio}
              disabled={voted !== undefined}
              onChange={() => { this.setState({ selected: k }) }}
            />
            <span>{k}</span>
            {k === voted && <span className="ml1 x-small color1-l">YOU VOTED</span>}
          </label>
        ))}
        {loggedIn && (
          <label className={labelClassName} >
            <input
              type="text"
              disabled={!loggedIn}
              className={textInput + ' p1'}
              placeholder="Add a new option"
              value={newKey}
              onChange={e => {
                this.setState({ newKey: e.currentTarget.value })
              }}
            />
            <button
              className={btnSmall + ' h4 color1 '}
              disabled={!loggedIn || !newKeyTrimmed || _o.map(el => el.k).includes(newKeyTrimmed)}
              onClick={() => {
                addKey(newKeyTrimmed)
                  .then(r => {
                    if (!r) return
                    this.setState({ newKey: '' })
                  })
              }}
            >
              Add
            </button>
          </label>
        )}
        <button
          className={btn + ' mt2 mx-auto block '}
          disabled={voted || typeof selected === 'undefined'}
          onClick={() => { vote(this.state.selected) }}
        >
          <span className="h6 color-inherit pre">VOTE</span>
        </button>
        {hr}
        {!nVote ?
          <span className="silver">No vote yet</span> :
          showResult || this.props.voted ?
            <Chart data={_o} /> :
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

export default class extends Component {
  constructor(props) {
    super(props)
    this.id = parseInt(this.props.match.params.id, 36) // eslint-disable-line react/prop-types
    if (process.env.APP_ENV === 'server') return
    this.client = require('~/client/apolloClient').default
  }
  state = {
    votedPolls: null,
    loggedInUser: null,
  }
  componentDidMount() {
    if (process.env.APP_ENV === 'server') return
    const { client } = this

    this.sub = client.watchQuery({
      query: gql`{ loggedInUser { token } }`,
      fetchPolicy: 'cache-only',
    }).subscribe({
      next: ({ data: { loggedInUser } }) => {
        if (this.unmounted) return
        if (!loggedInUser) return
        if (this.state.votedPolls) return
        client.query({
          query: gql`query ($token: String) { votedPolls(token: $token) @connection(key: "votedPolls") }`,
          variables: { token: loggedInUser.token }
        }).then(({ data: { votedPolls } }) => {
          if (this.unmounted) return
          if (typeof votedPolls === 'string') votedPolls = JSON.parse(votedPolls)
          client.writeQuery({
            query: gql`{ votedPolls @connection(key: "votedPolls") }`,
            data: { votedPolls }
          })
          this.setState({
            votedPolls: { ...votedPolls }, // votedPolls is an immutable, frozen object, so need to clone it
            loggedInUser
          })
        })
      }
    })
  }
  componentWillUnmount() {
    this.unmounted = true
    this.sub.unsubscribe()
  }
  votePoll = key => {
    if (process.env.APP_ENV === 'server') return undefined
    const { client, id } = this
    return client.mutate({
      mutation: gql`mutation ($id: Int!, $key: String!, $token: String) {
        votePoll(id: $id, key: $key, token: $token) @connection (key: "votePoll")
      }`,
      variables: { id, key, token: this.state.loggedInUser.token },
      update(proxy, { data: { votePoll } }) {
        if (!votePoll) return
        const pid = 'Poll:' + id
        const fragment = {
          id: pid,
          fragment: gql`fragment f on Poll { nVote, _o }`
        }
        const f = proxy.readFragment(fragment)
        fragment.data = {
          ...f,
          nVote: f.nVote + 1,
          _o: f._o.map(el => {
            if (el.k === key) return { k: key, v: el.v + 1 }
            return el
          })
        }

        proxy.writeFragment(fragment)
      }
    }).then(({ data: { votePoll } }) => {
      if (!votePoll) return 0
      const { votedPolls } = this.state
      votedPolls[id] = key
      client.writeQuery({
        query: gql`{ votedPolls @connection(key: "votedPolls") }`,
        data: { votedPolls }
      })
      this.setState({ votedPolls })
      return votePoll
    })
  }
  addKey = key => {
    if (process.env.APP_ENV === 'server') return undefined
    const { client, id } = this
    return client.mutate({
      mutation: gql`mutation ($id: Int!, $key: [String!]!, $token: String!) {
        addKey(id: $id, key: $key, token: $token) @connection (key: "addKey")
      }`,
      variables: {
        id,
        key,
        token: this.state.loggedInUser.token
      },
      update(proxy, { data: { addKey } }) {
        if (!addKey) return
        const pid = 'Poll:' + id
        const fragment = {
          id: pid,
          fragment: gql`fragment f on Poll { _o }`
        }
        const f = proxy.readFragment(fragment)
        fragment.data = {
          ...f,
          _o: f._o.concat({ k: key, v: 0 })
        }
        proxy.writeFragment(fragment)
      }
    }).then(({ data: { addKey } }) => addKey)
  }
  render() {
    const { votedPolls, loggedInUser } = this.state
    return (
      <Query
        query={gql`query ($id: Int!) { getPoll(id: $id) { id, q, o, _o @client, nVote @client } }`}
        variables={{ id: this.id }}
      >
        {({ loading, error, data }) => {
          const getPoll = data && data.getPoll
          return (
            <Fragment>
              {loading && <span className="spinner" />}
              {error && <span>There is an error</span>}
              {getPoll && (
                <PollResult
                  data={getPoll}
                  voted={votedPolls && votedPolls[getPoll.id]}
                  vote={this.votePoll}
                  addKey={this.addKey}
                  loggedIn={loggedInUser && !!loggedInUser.token}
                />
              )}
              {!loading && !getPoll && (
                <p>
                  The poll you requested does not exist
                </p>
              )}
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

