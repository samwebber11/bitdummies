import AppError from './AppError'

class InvalidSizeError extends AppError {
  constructor(message) {
    super(message || 'Invalid size')
  }
}

export default InvalidSizeError
