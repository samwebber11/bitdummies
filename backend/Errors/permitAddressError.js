import AppError from './error'

class PermitUpdateAddressError extends AppError {
  constructor(message) {
    super('User is unauthorized to update address')
  }
}

class PermitDeleteAddressError extends AppError {
  constructor(message) {
    super('User is unauhorized to delete address')
  }
}

class UserFindError extends AppError {
  constructor(message) {
    super('Error! Unable to find user')
  }
}

export { PermitUpdateAddressError, PermitDeleteAddressError, UserFindError }
