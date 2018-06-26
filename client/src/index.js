import React from 'react'
import ReactDOM from 'react-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-bootstrap-carousel/dist/react-bootstrap-carousel.css'

import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { store, persistor, history } from './store'

import './static/icons/fontawesome-all.min.css'
import './static/styles/index.css'

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
