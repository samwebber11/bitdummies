import AppError from './AppError'

class InvalidOrderStatusError extends AppError {
  constructor(message) {
    super(message || 'Invalid order status')
  }
}

export default InvalidOrderStatusError
