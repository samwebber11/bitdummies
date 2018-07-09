import AppError from './error'

class AddAddressError extends AppError {
  constructor(message) {
    super('Error! Unable to add address')
  }
}

class DeleteAddressError extends AppError {
  constructor(message) {
    super('Unauthorized to delete this address')
  }
}

class UpdateAddressError extends AppError {
  constructor(message) {
    super('Error! Unable to update address')
  }
}

class AddressSaveError extends AppError {
  constructor(message) {
    super('Error! Updating address')
  }
}

class CheckAddressError extends AppError {
  constructor(message) {
    super('Invalid address')
  }
}

class CheckUserAddressError extends AppError {
  constructor(message) {
    super('Address is not associated with user')
  }
}

export {
  AddAddressError,
  DeleteAddressError,
  UpdateAddressError,
  AddressSaveError,
  CheckAddressError,
  CheckUserAddressError,
}
