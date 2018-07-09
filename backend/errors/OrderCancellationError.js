import AppError from './AppError'

class OrderCancellationError extends AppError {
  constructor(message) {
    super(message || 'Order cannot be cancelled now')
  }
}

export default OrderCancellationError
