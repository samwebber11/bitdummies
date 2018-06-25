import React, { Component } from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'

import CartProductCard from './CartProductCard'
import CartBill from './CartBill'
import calculateBill from './calculateBill'

class CartScreen extends Component {
  state = {
    bill: calculateBill(this.props.cart),
  }

  render() {
    console.log('Cart: ', this.props.cart)
    return (
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-8">
            <div className="d-flex justify-content-between">
              <h6>My Shopping Cart</h6>
              <p>Total: ${this.state.bill.orderTotal.toFixed(2)}</p>
            </div>
            {this.props.cart.map(product => (
              <CartProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="col-md-4">
            <CartBill bill={this.state.bill} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ cart }) => ({
  cart,
})

CartScreen.propTypes = {
  cart: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.number.isRequired,
      name: propTypes.string.isRequired,
      imagePath: propTypes.string.isRequired,
      actualPrice: propTypes.number.isRequired,
      discount: propTypes.number,
      discountedPrice: propTypes.number,
      tax: propTypes.number,
    })
  ).isRequired,
}

export default connect(mapStateToProps)(CartScreen)
