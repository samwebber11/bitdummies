import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import axios from 'axios'

import Navbar from './components/Navbar'
import HomeScreen from './components/screens/HomeScreen/index'
import ProductsScreen from './components/screens/ProductsScreen/'
import ProductDetailsScreen from './components/screens/ProductDetailsScreen/'
import CartScreen from './containers/CartScreen'
import LoginScreen from './components/screens/LoginScreen'
import Footer from './components/Footer'

import './static/styles/App.css'

class App extends Component {
  state = {
    loggedIn: false,
  }

  componentDidMount = () => {
    axios.get('/auth/user').then(response => {
      console.log(response.data)
      if (response.data.user) {
        console.log('THERE IS A USER')
        this.setState({
          loggedIn: true,
        })
        console.log(this.state.loggedIn)
      } else {
        this.setState({
          loggedIn: false,
        })
      }
    })
  }

  logout = () => {
    console.log('Logging out')
    axios.post('/auth/logout').then(response => {
      console.log(response.data)
      if (response.status === 200) {
        this.setState({
          loggedIn: false,
        })
      }
    })
  }

  render() {
    return (
      <div>
        <Navbar loggedIn={this.state.loggedIn} logout={this.logout} />
        <Switch>
          <Route exact path="/" component={HomeScreen} />
          <Route exact path="/products" component={ProductsScreen} />
          <Route path="/products/:id" component={ProductDetailsScreen} />
          <Route exact path="/cart" component={CartScreen} />
          <Route exact path="/login" component={LoginScreen} />
        </Switch>
        <Footer />
      </div>
    )
  }
}

export default App
