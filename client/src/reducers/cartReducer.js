import { CART_ITEM_ADDED, CART_ITEM_REMOVED } from '../actions/constants'

const initialState = [
  {
    id: 1,
    name: 'Product 1',
    imagePath: 'https://source.unsplash.com/random/500x498',
    actualPrice: 342.99,
    discount: 15,
    discountedPrice: 291.54,
    tax: 12.5,
  },
  {
    id: 3,
    name: 'Product 3',
    imagePath: 'https://source.unsplash.com/random/500x499',
    actualPrice: 821.99,
    discount: 38,
    discountedPrice: 509.64,
    tax: 5,
  },
]

const cartReducer = (state = initialState, action) => {
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
