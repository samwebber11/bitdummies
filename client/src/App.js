import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import axios from 'axios'

import Navbar from './components/Navbar'
import HomeScreen from './components/screens/HomeScreen/index'
import ProductsScreen from './components/screens/ProductsScreen'
import SignupScreen from './components/screens/SignupScreen'
import Footer from './components/Footer'

import './App.css'

class App extends Component {
  state = {
    activeTab: 'home',
    loggedIn: false,
    user: null,
  }

  componentDidMount = () => {
    axios.get('/auth/user').then(response => {
      console.log(response.data)
      if (response.data.user) {
        console.log('THERE IS A USER')
        this.setState({
          loggedIn: true,
          user: response.data.user,
        })
        console.log(this.state.loggedIn)
      } else {
        this.setState({
          loggedIn: false,
          user: null,
        })
      }
    })
  }

  logout = event => {
    event.preventDefault()
    console.log('Logging out')
    axios.post('/auth/logout').then(response => {
      console.log(response.data)
      if (response.status === 200) {
        this.setState({
          loggedIn: false,
          user: null,
        })
      }
    })
  }

  render() {
    return (
      <div>
        <Navbar
          activeTab={this.state.activeTab}
          loggedIn={this.state.loggedIn}
          logout={this.logout}
        />
        <Route exact path="/" component={HomeScreen} />
        <Route path="/products" component={ProductsScreen} />
        <Route exact path="/login" component={SignupScreen} />
        <Footer />
      </div>
    )
  }
}

export default App
