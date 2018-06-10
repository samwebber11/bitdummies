import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import propTypes from 'prop-types'

import logo from '../logo.svg'

class Navbar extends Component {
  state = {
    activeTab: this.props.activeTab,
  }

  changeActiveTab = activeTab => {
    this.setState({ activeTab })
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img src={logo} alt="Logo" style={{ maxWidth: 30, padding: 5 }} />
              BitDummies
            </Link>
          </div>
          <div>
            <ul className="navbar-nav">
              {/* Home */}
              <li
                className={`nav-item ${
                  this.state.activeTab === 'home' ? 'active' : ''
                }`}
              >
                <Link
                  className="btn nav-link"
                  to="/"
                  onClick={() => this.changeActiveTab('home')}
                >
                  Home
                </Link>
              </li>

              {/* Products */}
              <li
                className={`nav-item ${
                  this.state.activeTab === 'products' ? 'active' : ''
                }`}
              >
                <Link
                  className="nav-link"
                  to="/products"
                  onClick={() => this.changeActiveTab('products')}
                >
                  Products
                </Link>
              </li>

              {/* Cart */}
              <li
                className={`nav-item ${
                  this.state.activeTab === 'cart' ? 'active' : ''
                }`}
              >
                <Link
                  className="nav-link"
                  to="/cart"
                  onClick={() => this.changeActiveTab('cart')}
                >
                  Cart
                </Link>
              </li>

              {/* Login and Logout */}
              {this.props.loggedIn ? (
                // If user is logged in, display the option for logging out.
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light"
                    onClick={() => this.props.logout()}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                // Else if user is not logged in, display the option for logging in.
                <li
                  className={`nav-item ${
                    this.state.activeTab === 'login' ? 'active' : ''
                  }`}
                >
                  <Link
                    className="btn btn-outline-light"
                    to="/login"
                    onClick={() => this.changeActiveTab('login')}
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

Navbar.propTypes = {
  activeTab: propTypes.string.isRequired,
  loggedIn: propTypes.bool.isRequired,
  logout: propTypes.func.isRequired,
}

export default Navbar
