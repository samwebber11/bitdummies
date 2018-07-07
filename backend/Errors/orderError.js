import { AppError } from './error'

class AddOrderError extends AppError {
  constructor(message) {
    super('Error!Unable to add order')
  }
}

class SaveOrderError extends AppError {
  constructor(message) {
    super('Error occured in saving order')
  }
}

class CheckOrderError extends AppError {
  constructor(message) {
    super('Invalid Order')
  }
}

class CancelOrderError extends AppError {
  constructor(message) {
    super('Order cannot be cancelled now')
  }
}

class OrderLinkError extends AppError {
  constructor(message) {
    super('Order does not belong to the current user')
  }
}

class OrderChangeError extends AppError {
  constructor(message) {
    super('Order items cannot be chnaged now')
  }
}

class CheckProductInOrderError extends AppError {
  constructor(message) {
    super('Product not found in order')
  }
}

class RemoveOrderError extends AppError {
  constructor(message) {
    super('Some error occured while removing products')
  }
}

class CheckStatusError extends AppError {
  constructor(message) {
    super('Invalid status')
  }
}

class OrderPendingError extends AppError {
  constructor(message) {
    super('Some orders are pending')
  }
}

class MinQuantityError extends AppError {
  constructor(message) {
    super('Order must have one product')
  }
}

export {
  AddOrderError,
  SaveOrderError,
  CheckStatusError,
  RemoveOrderError,
  CheckProductInOrderError,
  CheckOrderError,
  CancelOrderError,
  OrderLinkError,
  OrderChangeError,
  OrderPendingError,
  MinQuantityError,
}
