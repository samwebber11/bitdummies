import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'
import propTypes from 'prop-types'

import logo from '../logo.svg'

class Navbar extends Component {
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
          <div className="d-flex justify-content-between align-items-center">
            <ul className="navbar-nav px-2">
              <li className="nav-item">
                <NavLink exact className="nav-link" to="/">
                  Home
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/products">
                  Products
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/cart">
                  Cart
                </NavLink>
              </li>
            </ul>
            {/* Login and Logout */}
            {this.props.loggedIn ? (
              // If user is logged in, display the option for logging out.
              <button
                className="btn btn-outline-light"
                onClick={() => this.props.logout()}
              >
                Logout
              </button>
            ) : (
              // Else if user is not logged in, display the option for logging in.
              <NavLink className="btn btn-outline-light" to="/login">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    )
  }
}

Navbar.propTypes = {
  loggedIn: propTypes.bool.isRequired,
  logout: propTypes.func.isRequired,
}

export default Navbar
