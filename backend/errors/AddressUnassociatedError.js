import AppError from './AppError'

class AddressUnassociatedError extends AppError {
  constructor(message) {
    super(message || 'Address not associated with this user')
  }
}

export default AddressUnassociatedError
