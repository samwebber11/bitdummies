import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import HomeScreen from './components/screens/HomeScreen/index'
import ProductsScreen from './components/screens/ProductsScreen'
import SignupScreen from './components/screens/SignupScreen'
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
        <Route exact path="/" component={HomeScreen} />
        <Route path="/products" component={ProductsScreen} />
        <Route path="/login" component={SignupScreen} />
        <Footer />
      </div>
    )
  }
}

export default App
