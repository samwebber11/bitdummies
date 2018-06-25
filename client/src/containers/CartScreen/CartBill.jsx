import React from 'react'
import propTypes from 'prop-types'

const CartBill = ({ bill }) => {
  const { actualPriceTotal, discountTotal, taxTotal, orderTotal } = bill

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h6>Cart Total</h6>
          <p>${actualPriceTotal.toFixed(2)}</p>
        </div>
        <div className="d-flex justify-content-between">
          <h6>Cart Discount</h6>
          <p className="text-success">-${discountTotal.toFixed(2)}</p>
        </div>
        <div className="d-flex justify-content-between">
          <h6>Estimated Tax</h6>
          <p>${taxTotal.toFixed(2)}</p>
        </div>
        <div className="d-flex justify-content-between">
          <h6>Order total</h6>
          <p>${orderTotal.toFixed(2)}</p>
        </div>
      </div>
      <button className="btn btn-success">Place order</button>
    </div>
  )
}

CartBill.propTypes = {
  bill: propTypes.shape({
    actualPriceTotal: propTypes.number.isRequired,
    discountTotal: propTypes.number.isRequired,
    taxTotal: propTypes.number.isRequired,
    orderTotal: propTypes.number.isRequired,
  }).isRequired,
}

export default CartBill
