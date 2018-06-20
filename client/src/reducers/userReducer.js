import {
  USER_AUTH_CHECK_REQUEST,
  USER_AUTH_CHECK_SUCCESS,
  USER_AUTH_CHECK_FAILURE,
} from '../actions/constants'

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_AUTH_CHECK_REQUEST:
      return state
    case USER_AUTH_CHECK_SUCCESS:
      return {
        ...state,
        ...action.user,
      }
    case USER_AUTH_CHECK_FAILURE:
      return state
    default:
      return state
  }
}

export default userReducer
