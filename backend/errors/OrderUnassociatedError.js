import AppError from './AppError'

class OrderUnassociatedError extends AppError {
  constructor(message) {
    super(message || 'Order not associated with this user')
  }
}

export default OrderUnassociatedError
