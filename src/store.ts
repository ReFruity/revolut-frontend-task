import { applyMiddleware, createStore, Store } from 'redux'
import createSagaMiddleware from 'redux-saga'
import dataReducer, { initialState } from './reducers/data-reducer'
import dataSaga from './sagas/data-saga'

const sagaMiddleware = createSagaMiddleware()

const store: Store = createStore(
  dataReducer,
  initialState,
  applyMiddleware(sagaMiddleware),
)

sagaMiddleware.run(dataSaga)

export default store
