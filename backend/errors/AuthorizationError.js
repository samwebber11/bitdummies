import AppError from './AppError'

class AuthorizationError extends AppError {
  constructor(message) {
    super(message || 'Unauthorized')
  }
}
export default AuthorizationError
