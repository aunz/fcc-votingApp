import React, { Component, Fragment } from 'react'
import { Switch, Route } from 'react-router'
import { Link } from 'react-router-dom'

import Header from './components/Header'
import LoginStatus from './components/LoginStatus'
import Polls from './components/Polls'
import PollResult from './components/PollResult'
import NewPoll from './components/NewPoll'

import './styles/index.css'

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <div className="my1"><LoginStatus /></div>
        <Route exact path="/" component={AddNewPoll} />
        <div className="mx-auto" style={{ maxWidth: '40rem' }}>
          <Switch>
            <Route exact path="/" component={Polls} />
            <Route path="/polls/:id" component={PollResult} />
            <Route path="/new" component={NewPoll} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Fragment>
    )
  }
}

function AddNewPoll() {
  return (
    <Link
      to="/new"
      className="block mt1 h2 bold center text-decoration-none color1"
    >
      +
    </Link>
  )
}

function NotFound() {
  return <p>Oops the page you requested does not exist</p>
}
