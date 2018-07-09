import AppError from './AppError'

class OrderPendingError extends AppError {
  constructor(message) {
    super(message || 'Some orders are pending')
  }
}

export default OrderPendingError
