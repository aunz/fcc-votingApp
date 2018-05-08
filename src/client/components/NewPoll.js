import React, { Component } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'

import { btn, btnFlat, textInput } from '~/client/styles/styles'

export default class NewPoll extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  }
  state = {
    q: '', // poll name
    options: '', // poll options
    loggedInUser: {},
    loading: true,
    message: false,
  }
  componentDidMount() {
    if (process.env.APP_ENV === 'server') return
    const client = require('~/client/apolloClient').default
    this.sub = client.watchQuery({
      query: gql`{ loggedInUser { id, token } }`,
      fetchPolicy: 'cache-only',
    }).subscribe({
      next: ({ data: { loggedInUser }, loading }) => {
        if (this.unmounted) return
        this.setState({ loading })
        if (!loggedInUser) return
        this.setState({ loggedInUser })
      }
    })
  }
  componentWillUnmount() {
    this.unmounted = true
    this.sub.unsubscribe()
  }
  onClick = () => {
    if (process.env.APP_ENV === 'server') return
    const q = this.state.q.trim()
    const o = this.split_dedup(this.state.options)
    const client = require('~/client/apolloClient').default
    this.setState({ loading: true })
    client.mutate({
      mutation: gql`mutation ($q: String!, $o: [String!]!, $token: String!) {
        createPoll(q: $q, o: $o, token: $token) @connection (key: "createPoll")
      }`,
      variables: {
        q, o, token: this.state.loggedInUser.token
      },
      update: (proxy, { data: { createPoll } }) => {
        if (!createPoll) return
        const query = gql`{ getPolls @connection(key: "getPolls") { id, q, o, _o, nVote } }`
        client.query({
          query,
          fetchPolicy: 'cache-only'
        }).then(({ data: { getPolls } }) => {
          if (!getPolls) return
          const newPoll = {
            id: createPoll,
            q,
            o: null,
            _o: o.map(el => ({ k: el, v: 0 })),
            nVote: 0,
            __typename: 'Poll',
          }
          client.writeQuery({
            query,
            data: {
              getPolls: [].concat(newPoll, getPolls)
            }
          })
          this.props.history.push('/')
        })
      }
    }).then(({ data: { createPoll } }) => {
      if (!createPoll) this.setState({ message: true })
    }).catch(e => {
      console.log('the e', e)
    }).finally(() => {
      this.unmounted || this.setState({ loading: false })
    })
  }
  split_dedup(string = '', regex = /[,\n]/) { // eslint-disable-line class-methods-use-this
    if (process.env.APP_ENV === 'server') return undefined
    const obj = string.trim().split(regex).reduce((p, c) => {
      p[c.trim()] = true
      return p
    }, {})
    return Object.keys(obj)
  }
  render() {
    const { loading, message } = this.state
    if (!this.state.loggedInUser.id) {
      if (loading) return <div className="spinner my1 center" />
      return <p className="my1 center">Log in to create a new poll</p>
    }
    const q = this.state.q.trim()
    const options = this.split_dedup(this.state.options)
    const spanClassName = 'mr1 center'
    const textClassName = textInput + ' p1 col-12 mt1 mb3'
    return (
      <div className="mt3">
        <span className={spanClassName}>Poll name</span>
        <input
          className={textClassName}
          onChange={e => {
            this.setState({
              q: e.currentTarget.value,
              message: false
            })
          }}
        />
        <span className={spanClassName}>Options, at least 2, seperate each by comma or line break</span>
        <textarea
          className={textClassName}
          rows="10"
          onChange={e => {
            this.setState({
              options: e.currentTarget.value,
              message: false
            })
          }}
        />
        <div className="flex">
          <button
            className={btn + ' mx-auto block '}
            onClick={this.onClick}
            disabled={loading || q.length < 3 || options.length < 2}
          >
            Create a new poll
          </button>
          <button className={btnFlat} onClick={() => { this.props.history.push('/') }}>
            Cancel
          </button>
        </div>
        {loading && <div className="spinner my1 center" />}
        {message && <p>No poll was created, it is likely that you have created a poll with the same poll name earlier. Change the poll name!</p>}
      </div>
    )
  }
}
