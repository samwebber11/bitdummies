import AppError from './AppError'

class InvalidQuantityError extends AppError {
  constructor(message) {
    super(message || 'Invalid quantity')
  }
}

export default InvalidQuantityError
