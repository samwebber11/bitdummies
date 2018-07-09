import AppError from './AppError'

class AddressNotFoundError extends AppError {
  constructor(message) {
    super(message || 'Address not found')
  }
}

export default AddressNotFoundError
