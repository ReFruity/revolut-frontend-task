import { boundMethod } from 'autobind-decorator'
import * as React from 'react'
import { ChangeEvent } from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { fetchDataRequest } from 'src/actions/data-actions'
import { exchangeCurrencies } from 'src/actions/wallet-actions'
import { Currency } from 'src/constants/currency-constants'
import { Symbols } from 'src/constants/currency-constants'
import { DataState, ExchangeRates } from 'src/types/data-types'
import { StoreState } from 'src/types/store-types'
import { WalletAmounts } from 'src/types/wallet-types'

interface Props {
  exchangeRates: ExchangeRates
  walletAmounts: WalletAmounts
  dispatch: (action: Action) => void
}

interface State {
  currencyFrom: Currency
  currencyTo: Currency
  amountFrom: number
  amountTo: number
}

class App extends React.Component<Props, State> {
  state: State = {
    currencyFrom: Currency.USD,
    currencyTo: Currency.EUR,
    amountFrom: 0,
    amountTo: 0,
  }

  componentDidMount(): void {
    // TODO: Poll once in 10 seconds
    this.props.dispatch(fetchDataRequest())
  }

  @boundMethod
  onCurrencyFromChange(event: ChangeEvent<HTMLInputElement>): void {
    const { exchangeRates } = this.props
    const amountFrom = parseInt(event.target.value, 10)
    this.setState({ amountFrom, amountTo: amountFrom * exchangeRates.rates[Currency.EUR] })
  }

  @boundMethod
  onCurrencyToChange(event: ChangeEvent<HTMLInputElement>): void {
    const { exchangeRates } = this.props
    const amountTo = parseInt(event.target.value, 10)
    this.setState({ amountTo, amountFrom: amountTo * exchangeRates.rates[Currency.EUR] })
  }

  @boundMethod
  onExchangeClick() {
    const { currencyFrom, currencyTo, amountFrom, amountTo } = this.state

    this.props.dispatch(exchangeCurrencies({
      currencyFrom,
      currencyTo,
      amountFrom,
      amountTo,
    }))
  }

  render(): React.ReactNode {
    const { exchangeRates, walletAmounts } = this.props
    const { currencyFrom, currencyTo, amountFrom, amountTo } = this.state

    return (
      <div>
        <div>{ `1${Symbols[currencyFrom]} = ${exchangeRates.rates[currencyTo]}${Symbols[currencyTo]}` }</div>
        <div>{ `${currencyFrom} (You have ${Symbols[currencyFrom]}${walletAmounts[currencyFrom] || 0})` }</div>
        <div>
          <input
            type='number'
            name='currencyFrom'
            onChange={this.onCurrencyFromChange}
            value={amountFrom}
          />
        </div>
        <div>{ `${currencyTo} (You have ${Symbols[currencyTo]}${walletAmounts[currencyTo] || 0})` }</div>
        <div>
          <input
            type='number'
            name='currencyTo'
            onChange={this.onCurrencyToChange}
            value={amountTo}
          />
        </div>
        <div>
          <button
            disabled={currencyTo === currencyFrom}
            onClick={this.onExchangeClick}
          >
            Exchange
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    exchangeRates: state.dataReducer.exchangeRates,
    walletAmounts: state.walletReducer.walletAmounts,
  }
}

export default connect(mapStateToProps)(App)
