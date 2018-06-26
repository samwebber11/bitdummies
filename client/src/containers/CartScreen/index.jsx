import React, { Component } from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import { bindActionCreators } from 'redux'

import CartProductCard from './CartProductCard'
import CartBill from './CartBill'
import calculateBill from './calculateBill'
import { removeItemFromCart } from '../../actions/cartActions'

class CartScreen extends Component {
  state = {
    bill: {
      actualPriceTotal: 0,
      discountTotal: 0,
      taxTotal: 0,
      orderTotal: 0,
    },
  }

  componentDidMount() {
    this.updateBill(this.props.cart)
  }

  componentWillReceiveProps(nextProps) {
    this.updateBill(nextProps.cart)
  }

  removeProduct = id => {
    this.props.removeItemFromCart(id)
  }

  updateBill = cart => {
    this.setState({ bill: calculateBill(cart) })
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
              <CartProductCard
                key={product.id}
                product={product}
                handleClick={() => this.removeProduct(product.id)}
              />
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
  removeItemFromCart: propTypes.func.isRequired,
}

const mapStateToProps = ({ cart }) => ({
  cart,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ removeItemFromCart }, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartScreen)
