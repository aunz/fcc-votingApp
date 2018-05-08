import React, { Component } from 'react'
import Query from 'react-apollo/Query'
import gql from 'graphql-tag'

import Poll from './Poll'
import '~/client/styles/spinner.css'

import { btn } from '~/client/styles/styles'

export default class extends Component {
  state = {
    hasMore: true
  }
  render() {
    const { hasMore } = this.state
    return (
      <Query
        query={gql`query getPolls ($lim: Int, $before: Int) {
          getPolls(lim: $lim, before: $before) @connection(key: "getPolls") { id, q, o, _o @client, nVote @client }
        }`}
        variables={{ lim: 50 }}
        notifyOnNetworkStatusChange
      >
        {({ loading, error, data, updateQuery, fetchMore }) => {
          return (
            <div>
              {loading && <span className="spinner" />}
              {error && <span>There is an error</span>}
              {data && data.getPolls && data.getPolls.map(({ id, q, nVote }) => {
                // const nVote = JSON.parse(o).reduce((p, n) => p + n.v, 0)
                // const nVote = 11
                return (
                  <Poll
                    key={id}
                    id={id + ''}
                    q={q}
                    nVote={nVote}
                  />
                )
              })}
              <button
                className={btn + ' block mt2 mx-auto'}
                key="button"
                disabled={!hasMore}
                onClick={() => {
                  const before = data.getPolls[data.getPolls.length - 1].id
                  fetchMore({
                    variables: { before },
                    updateQuery: (p, { fetchMoreResult }) => {
                      if (!fetchMoreResult.getPolls.length) {
                        this.setState({ hasMore: false })
                        return undefined
                      }
                      return {
                        getPolls: [].concat(p.getPolls, fetchMoreResult.getPolls)
                      }
                    }
                  })
                }}
              >
                More
              </button>
              {hasMore || <p className="center">No more poll</p>}
            </div>
          )
        }}
      </Query>
    )
  }
}

