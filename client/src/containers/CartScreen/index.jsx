import React, { Component } from 'react'

import CartProducts from './CartProducts'
import CartBill from './CartBill'

class CartScreen extends Component {
  render() {
    return (
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-8">
            <CartProducts />
          </div>
          <div className="col-md-4">
            <CartBill />
          </div>
        </div>
      </div>
    )
  }
}

export default CartScreen
