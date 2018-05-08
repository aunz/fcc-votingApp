import { parse, stringify } from 'querystring'
import React, { Component, Fragment } from 'react'
import gql from 'graphql-tag'


import { btnSmall } from '~/client/styles/styles'
import '~/client/styles/spinner.css'
import '~/client/styles/fontello/css/fontello.css'

export default class extends Component {
  state = {
    loggedInUser: undefined,
    loading: false,
    error: undefined,
    GH_CLIENT_ID: '',
  }
  componentWillMount() {
    if (process.env.APP_ENV === 'server') return
    const client = require('~/client/apolloClient').default
    client.query({
      query: gql`{ getClientId }`
    }).then(({ data: { getClientId } }) => {
      this.setState({ GH_CLIENT_ID: getClientId })
    })

    const { get, set, del } = require('idb-keyval')

    if (process.env.TEST && this.props.testParams) { // eslint-disable-line
      this.setState(this.props.testParams) // testParams { loggedInUser, loading, error }
      return
    }

    const loginThenStore = (provider, code) => {
      this.setState({ loading: true })
      return client.mutate({
        mutation: gql`mutation ($provider: String!, $code: String!) { loginWith(provider: $provider, code: $code) { id, name, gh_name, token } }`,
        variables: { provider, code },
        fetchPolicy: 'no-cache',
      }).then(({ data: { loginWith } = {} }) => {
        if (!loginWith || !loginWith.token) {
          del('loggedInUser')
          throw new Error('Error logging in')
        }
        this.setState({ loggedInUser: loginWith })
        client.writeQuery({
          query: gql`{ loggedInUser { id, token } }`,
          data: { loggedInUser: loginWith }
        })
        return set('loggedInUser', loginWith)
      }).catch(e => {
        console.dir(e)
        this.setState({ error: 'Login failed' })
      }).finally(() => {
        this.setState({ loading: false })
      })
    }

    const href = window.location.href.split('?')
    const { code, state, ...restHref } = parse(href[1])

    // check storage first
    if (!code && !state) {
      get('loggedInUser').then(loggedInUser => {
        if (loggedInUser && loggedInUser.token) return loginThenStore('TOKEN', loggedInUser.token)
        client.writeQuery({
          query: gql`{ loggedInUser { id }}`,
          data: { loggedInUser: { id: null, __typename: 'LoggedInUser' } }
        })
        return undefined
      })
      return
    }

    // if there is a code or state in href (returned by GitHub)
    get('csrfToken')
      .then(token => code && state === token && loginThenStore('GH', code))
      .finally(() => { del('csrfToken') })

    // clean up the url, remove any querystring code or state returned by GitHub
    const newQs = stringify(restHref) // new query string
    const newUrl = href[0] + (newQs ? ('?' + newQs) : '')
    window.history.replaceState(null, null, newUrl)
  }
  componentDidMount() {}
  componentWillUnmount() {
    // this.unmounted = true // dont need this as this component will always be mounted
  }
  logout = () => {
    if (process.env.APP_ENV === 'server') return
    const { token } = this.state.loggedInUser
    const client = require('~/client/apolloClient.js').default
    require('idb-keyval').del('loggedInUser')
    client.mutate({
      mutation: gql`mutation logout($token: String!) { logout(token: $token) }`,
      variables: { token }
    }).then(() => {})
      .catch(() => {})
      .finally(() => { window.location.reload() })
  }
  render() {
    if (process.env.APP_ENV === 'server') return null

    const { loading, error, loggedInUser, GH_CLIENT_ID } = this.state

    if (loggedInUser) {
      const name = loggedInUser.name || loggedInUser.gh_name || 'Mysterion'
      return (
        <Fragment>
          <span id="loggedInUser">Hi, {name}!</span>
          <button
            id="logout"
            className={'icon-logout pointer absolute ' + btnSmall}
            style={{ right: 0 }}
            onClick={this.logout}
          />
        </Fragment>
      )
    }
    if (error) return (
      <Fragment>
        <span>{error}</span>
        <button
          className={btnSmall + ' circle red'}
          onClick={() => { this.setState({ error: undefined }) }}
        >
          ✖
        </button>
      </Fragment>
    )
    if (loading) return <span className="spinner" />

    return (
      <a
        id="login" // this id is linked to integration test
        href="/"
        rel="noopener nofollow"
        className="text-decoration-none"
        onClick={e => {
          // create a csrf token before sending off to GitHub
          if (process.env.APP_ENV === 'server') return
          e.preventDefault()
          if (!GH_CLIENT_ID) return
          const csrfToken = Array.from(window.crypto.getRandomValues(new Uint8Array(21)))
            .map(d => ('0' + d.toString(16)).slice(-2))
            .join('')
          require('idb-keyval').set('csrfToken', csrfToken).then(() => {
            window.location.href = 'https://github.com/login/oauth/authorize?' + stringify({
              client_id: GH_CLIENT_ID,
              redirect_uri: window.location.origin + window.location.pathname,
              state: csrfToken,
            })
          })
        }}
      >
        Login with <b>GitHub</b>
      </a>
    )
  }
}
