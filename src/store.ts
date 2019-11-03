import { applyMiddleware, compose, createStore, Store } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { initialState as initialDataState } from 'src/reducers/data-reducer'
import rootReducer from 'src/reducers/root-reducer'
import { initialState as initialWalletState } from 'src/reducers/wallet-reducer'
import dataSaga from 'src/sagas/data-saga'
import { StoreState } from 'src/types/store-types'

const sagaMiddleware = createSagaMiddleware()

const initialState: StoreState = {
  dataReducer: initialDataState,
  walletReducer: initialWalletState,
}

const store: Store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(sagaMiddleware),
)

sagaMiddleware.run(dataSaga)

export default store
