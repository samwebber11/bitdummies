import { AppError } from './error'

class AuthError extends AppError {
  constructor(message) {
    super('User is not authenticated')
  }
}
export default { AuthError }
