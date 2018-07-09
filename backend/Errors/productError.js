import AppError from './error'

class UpdateProductError extends AppError {
  constructor(message) {
    super('Could not update product')
  }
}

class FindProductError extends AppError {
  constructor(message) {
    super('Product not found')
  }
}

class InvalidCredentialsError extends AppError {
  constructor(message) {
    super('Must provide label and quantity for size')
  }
}

class QuantityExceedError extends AppError {
  constructor(message) {
    super('Quantity limit Exceed')
  }
}

class ProductCheckError extends AppError {
  constructor(message) {
    super('Products not present in database')
  }
}
export {
  UpdateProductError,
  FindProductError,
  InvalidCredentialsError,
  QuantityExceedError,
  ProductCheckError,
}
