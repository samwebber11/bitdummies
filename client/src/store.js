import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { createStore, applyMiddleware } from 'redux'

import rootReducer from './reducers'

const history = createHistory()
const middleware = [thunk, routerMiddleware(history)]
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['router'],
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(
  connectRouter(history)(persistedReducer),
  applyMiddleware(...middleware)
)
const persistor = persistStore(store)

export { store, persistor, history }
