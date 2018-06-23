import React from 'react'

const calculateBill = products => {
  const finalBill = products.reduce(
    (bill, product) => {
      bill.cartTotal += product.cost
      bill.totalDiscount += product.discount
      bill.totalTax += product.tax

      return bill
    },
    {
      cartTotal: 0,
      totalDiscount: 0,
      totalTax: 0,
    }
  )

  const { cartTotal, totalDiscount, totalTax } = finalBill
  return {
    cartTotal,
    totalDiscount,
    totalTax,
    orderTotal: cartTotal - totalDiscount + totalTax,
  }
}

const products = [
  { cost: 324, discount: 21, tax: 43 },
  { cost: 473, discount: 23, tax: 67 },
  { cost: 583, discount: 53, tax: 81 },
  { cost: 532, discount: 43, tax: 75 },
]

const CartBill = () => {
  const { cartTotal, totalDiscount, totalTax, orderTotal } = calculateBill(
    products
  )

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h6>Cart Total</h6>
          <p>{cartTotal}</p>
        </div>
        <div className="d-flex justify-content-between">
          <h6>Cart Discount</h6>
          <p className="text-success">-{totalDiscount}</p>
        </div>
        <div className="d-flex justify-content-between">
          <h6>Estimated Tax</h6>
          <p>{totalTax}</p>
        </div>
        <div className="d-flex justify-content-between">
          <h6>Order total</h6>
          <p>{orderTotal}</p>
        </div>
      </div>
      <button className="btn btn-success">Place order</button>
    </div>
  )
}

export default CartBill
