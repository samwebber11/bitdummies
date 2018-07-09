import AppError from './AppError'

class ProductNotFoundError extends AppError {
  constructor(message) {
    super(message || 'Product not found')
  }
}

export default ProductNotFoundError
