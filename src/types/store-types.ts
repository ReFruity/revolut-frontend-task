import { DataState, ExchangeRates } from 'src/types/data-types'
import { WalletAmounts, WalletState } from 'src/types/wallet-types'

export interface StoreState {
  dataReducer: DataState
  walletReducer: WalletState
}
