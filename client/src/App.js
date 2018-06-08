import React, { Component } from 'react'

import Navbar from './components/Navbar'
import Home from './components/Home'
import Footer from './components/Footer'

import './App.css'

class App extends Component {
  state = {
    loggedIn: false,
    cart: 0,
  }

  render() {
    return (
      <div className="">
        <Navbar cart={this.state.cart} />
        <Home />
        <Footer />
      </div>
    )
  }
}

export default App
