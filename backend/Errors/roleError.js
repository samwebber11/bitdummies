import { AppError } from './error'

class RoleChangeError extends AppError {
  constructor(message) {
    super('Cannot create another account while other is signed in')
  }
}

class RoleCheckError extends AppError {
  constructor(message) {
    super('Invalid Roles')
  }
}
export { RoleChangeError, RoleCheckError }
