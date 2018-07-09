import AppError from './AppError'

class AuthenticationError extends AppError {
  constructor(message) {
    super(message || 'Unauthenticated')
  }
}
export default AuthenticationError
