import AppError from './AppError'

class InvalidRolesError extends AppError {
  constructor(message) {
    super(message || 'Invalid roles')
  }
}

export default InvalidRolesError
