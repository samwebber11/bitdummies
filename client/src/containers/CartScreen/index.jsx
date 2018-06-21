import React, { Component } from 'react'

import CartProducts from './CartProducts'

class CartScreen extends Component {
  render() {
    return (
      <div className="container mt-3">
        <CartProducts />
      </div>
    )
  }
}

export default CartScreen
