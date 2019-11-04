import { Currency } from 'src/constants/currency-constants'
import { EXCHANGE_CURRENCIES, ExchangeCurrenciesAction, WalletState } from 'src/types/wallet-types'

export const initialState: WalletState = {
  walletAmounts: {
    [Currency.USD]: 100,
  },
}

export default function walletReducer(
  state = initialState,
  action: ExchangeCurrenciesAction,
): WalletState {
  switch (action.type) {
    case EXCHANGE_CURRENCIES:
      const { currencyFrom, currencyTo, amountFrom, amountTo } = action.options
      const nextAmountFrom = (state.walletAmounts[currencyFrom] || 0) + amountFrom
      const nextAmountTo = (state.walletAmounts[currencyTo] || 0) + amountTo

      if (nextAmountFrom < 0 || nextAmountTo < 0) {
        return state
      }

      return {
        walletAmounts: {
          ...state.walletAmounts,
          [currencyFrom]: nextAmountFrom,
          [currencyTo]: nextAmountTo,
        },
      }
    default:
      return state
  }
}
