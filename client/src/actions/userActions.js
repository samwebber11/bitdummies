import {
  USER_AUTH_CHECK_REQUEST,
  USER_AUTH_CHECK_SUCCESS,
  USER_AUTH_CHECK_FAILURE,
} from './constants'

const userAuthCheckRequest = () => ({
  type: USER_AUTH_CHECK_REQUEST,
})

const userAuthCheckSuccess = user => ({
  type: USER_AUTH_CHECK_SUCCESS,
  user,
})

const userAuthCheckFailure = () => ({
  type: USER_AUTH_CHECK_FAILURE,
})

const userAuthCheckAction = () => async dispatch => {
  try {
    dispatch(userAuthCheckRequest())
    // TODO: Fetch 'user' from either the GraphQL server or the Route server.
    const data = {}
    if (data.user) {
      dispatch(userAuthCheckSuccess(data.user))
    } else {
      dispatch(userAuthCheckSuccess(null))
    }
  } catch (error) {
    console.error(error.message)
    dispatch(userAuthCheckFailure())
  }
}

export default userAuthCheckAction
