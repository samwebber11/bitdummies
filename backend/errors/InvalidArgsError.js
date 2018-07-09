import AppError from './AppError'

class InvalidArgsError extends AppError {
  constructor(message) {
    super(message || 'Invalid arguments')
  }
}

export default InvalidArgsError
