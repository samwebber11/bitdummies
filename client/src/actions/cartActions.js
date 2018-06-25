import { CART_ITEM_ADDED, CART_ITEM_REMOVED } from './constants'

export const addItemToCart = item => ({
  type: CART_ITEM_ADDED,
  payload: item,
})

export const removeItemFromCart = id => ({
  type: CART_ITEM_REMOVED,
  payload: id,
})
