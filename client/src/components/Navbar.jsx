import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import propTypes from 'prop-types'

class Navbar extends Component {
  state = {
    cart: this.props.cart,
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-between">
        <Link className="navbar-brand" to="/">
          BitDummies
        </Link>
        <div>
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Home <span className="sr-only">(current)</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Signup/Signin
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart ({this.state.cart})
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

Navbar.propTypes = {
  cart: propTypes.number,
}

Navbar.defaultProps = {
  cart: 0,
}

export default Navbar
