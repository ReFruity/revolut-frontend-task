import { Currency } from 'src/constants/currency-constants'

export const EXCHANGE_CURRENCIES = 'EXCHANGE_CURRENCIES'

export interface ExchangeCurrenciesOptions {
  currencyFrom: Currency
  currencyTo: Currency
  amountFrom: number
  amountTo: number
}

export interface ExchangeCurrenciesAction {
  type: typeof EXCHANGE_CURRENCIES
  options: ExchangeCurrenciesOptions
}

export interface WalletState {
  walletAmounts: { [currency: string]: number }
}

export interface WalletAmounts {
  [currency: string]: number
}
