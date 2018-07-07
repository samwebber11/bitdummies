import { AppError } from './error'

class FetchOneUserError extends AppError {
  constructor(message) {
    super('Unable to find any user by this ID')
  }
}

class FetchAllUsersError extends AppError {
  constructor(message) {
    super('Unable to fetch all users')
  }
}

export { FetchAllUsersError, FetchOneUserError }
