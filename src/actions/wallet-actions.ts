import { EXCHANGE_CURRENCIES, ExchangeCurrenciesAction, ExchangeCurrenciesOptions } from 'src/types/wallet-types'

export function exchangeCurrencies(options: ExchangeCurrenciesOptions): ExchangeCurrenciesAction {
  return {
    type: EXCHANGE_CURRENCIES,
    options,
  }
}
