const calculateBill = cart => {
  const finalBill = cart.reduce(
    (bill, product) => {
      bill.actualPriceTotal += product.actualPrice
      bill.discountTotal += product.actualPrice - product.discountedPrice
      bill.taxTotal += product.discountedPrice * (product.tax / 100)

      return bill
    },
    {
      actualPriceTotal: 0,
      discountTotal: 0,
      taxTotal: 0,
    }
  )

  const { actualPriceTotal, discountTotal, taxTotal } = finalBill

  return {
    actualPriceTotal,
    discountTotal,
    taxTotal,
    orderTotal: actualPriceTotal - discountTotal + taxTotal,
  }
}

export default calculateBill
