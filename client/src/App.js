import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './components/screens/Home/index'
import Footer from './components/Footer'

import './App.css'

class App extends Component {
  state = {
    loggedIn: false,
    cart: 0,
  }

  render() {
    return (
      <div>
        <Navbar cart={this.state.cart} />
        <Route exact path="/" component={Home} />
        <Footer />
      </div>
    )
  }
}

export default App
