import React, { Component } from 'react'

import CartProducts from './CartProducts'

class CartScreen extends Component {
  render() {
    return (
      <div className="container mt-3">
        <div className="col-md-8">
          <CartProducts />
        </div>
      </div>
    )
  }
}

export default CartScreen
