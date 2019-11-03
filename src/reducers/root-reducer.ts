import { combineReducers } from 'redux'
import dataReducer from 'src/reducers/data-reducer'
import walletReducer from 'src/reducers/wallet-reducer'

const rootReducer = combineReducers({
  dataReducer,
  walletReducer,
})

export default rootReducer
