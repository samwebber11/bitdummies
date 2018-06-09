import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import propTypes from 'prop-types'

import logo from '../logo.svg'

class Navbar extends Component {
  state = {
    activeTab: this.props.activeTab,
  }

  generateListItem = (title, tabName, to, rest) => (
    <li
      className={`nav-item ${this.state.activeTab === tabName ? 'active' : ''}`}
    >
      <Link
        className="nav-link"
        to={to}
        onClick={() => this.setState({ activeTab: tabName })}
      >
        {title}
        {rest}
      </Link>
    </li>
  )

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
              {this.generateListItem('Home', 'home', '/')}
              {this.generateListItem('Products', 'products', '/products')}
              {this.generateListItem('Login', 'login', '/login')}
              {this.generateListItem('Cart', 'cart', '/cart', `(0)`)}
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
