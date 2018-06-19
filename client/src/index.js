import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'
import {
  connectRouter,
  ConnectedRouter,
  routerMiddleware,
} from 'connected-react-router'

import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App'
import rootReducer from './reducers'
import registerServiceWorker from './registerServiceWorker'

import './static/icons/fontawesome-all.min.css'
import './static/styles/index.css'

const history = createHistory()
const middleware = [thunk, routerMiddleware(history)]

const store = createStore(
  connectRouter(history)(rootReducer),
  applyMiddleware(...middleware)
)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
