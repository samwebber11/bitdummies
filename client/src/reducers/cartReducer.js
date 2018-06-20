import { CART_ITEM_ADDED, CART_ITEM_REMOVED } from '../actions/constants'

const cartReducer = (state = [], action) => {
  switch (action.type) {
    case CART_ITEM_ADDED:
      return [...state, action.item]
    case CART_ITEM_REMOVED:
      return state.filter(item => item.id !== action.id)
    default:
      return state
  }
}

export default cartReducer
