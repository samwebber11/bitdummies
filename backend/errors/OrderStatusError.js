import AppError from './AppError'

class OrderStatusError extends AppError {
  constructor(message) {
    super(message || 'Error regarding order status')
  }
}

export default OrderStatusError
