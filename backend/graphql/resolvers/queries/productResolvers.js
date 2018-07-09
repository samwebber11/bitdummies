import Product from '../../../database/models/product'

const productsResolver = async (parent, args) => {
  try {
    const productsList = await Product.find(args.filters).sort(args.orderBy)
    return productsList
  } catch (err) {
    throw err
  }
}

const productResolver = async (parent, args) => {
  try {
    const dbProduct = await Product.findById(args.id)
    return dbProduct
  } catch (err) {
    throw err
  }
}

export { productsResolver, productResolver }
