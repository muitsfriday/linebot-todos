/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import App from './containers/App'
import rootReducer from './root-reducers'

const ce = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

let initState = {

}

if (typeof window.initState === 'object') {
  initState = { ...initState, ...(window.initState) }
}

const store = createStore(
  rootReducer,
  initState,
  ce(applyMiddleware(thunk)),
)


const render = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    document.getElementById('react-root'),
  )
}

render(App)
