import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import propTypes from 'prop-types'

class Navbar extends Component {
  state = {
    activeTab: this.props.activeTab,
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container d-flex justify-content-between">
          <Link className="navbar-brand" to="/">
            BitDummies
          </Link>
          <div>
            <ul className="navbar-nav">
              <li
                className={`nav-item ${
                  this.state.activeTab === 'home' ? 'active' : ''
                }`}
              >
                <Link
                  className="nav-link"
                  to="/"
                  onClick={() => {
                    this.setState({ activeTab: 'home' })
                  }}
                >
                  Home
                </Link>
              </li>
              <li
                className={`nav-item ${
                  this.state.activeTab === 'products' ? 'active' : ''
                }`}
              >
                <Link
                  className="nav-link"
                  to="/products"
                  onClick={() => {
                    this.setState({ activeTab: 'products' })
                  }}
                >
                  Products
                </Link>
              </li>
              <li
                className={`nav-item ${
                  this.state.activeTab === 'login' ? 'active' : ''
                }`}
              >
                <Link
                  className="nav-link"
                  to="/login"
                  onClick={() => {
                    this.setState({ activeTab: 'login' })
                  }}
                >
                  Signup/Signin
                </Link>
              </li>
              <li
                className={`nav-item ${
                  this.state.activeTab === 'cart' ? 'active' : ''
                }`}
              >
                <Link
                  className="nav-link"
                  to="/cart"
                  onClick={() => {
                    this.setState({ activeTab: 'cart' })
                  }}
                >
                  Cart ({this.state.cart})
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

Navbar.propTypes = {
  activeTab: propTypes.string.isRequired,
}

export default Navbar
