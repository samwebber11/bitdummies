import AppError from './AppError'

class OrderNotFoundError extends AppError {
  constructor(message) {
    super(message || 'Order not found')
  }
}

export default OrderNotFoundError
