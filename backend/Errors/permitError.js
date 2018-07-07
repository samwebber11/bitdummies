import { AppError } from './error'

class PermitError extends AppError {
  constructor(message) {
    super('User is not authorised for the operation')
  }
}
export default { PermitError }
