import { CART_ITEM_ADDED, CART_ITEM_REMOVED } from './constants'

const cartItemAdded = item => ({
  type: CART_ITEM_ADDED,
  item,
})

const cartItemRemoved = ({ id }) => ({
  type: CART_ITEM_REMOVED,
  id,
})

export default { cartItemAdded, cartItemRemoved }
