import AppError from './AppError'

class ProductUnassociatedError extends AppError {
  constructor(message) {
    super(message || 'Product not associated with this order')
  }
}

export default ProductUnassociatedError
