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
import './app.styl'

const CURRENCIES = [
  Currency.USD,
  Currency.EUR,
  Currency.GBP,
]

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
    const amountFrom = parseInt(event.target.value, 10)
    this.setState({ amountFrom, amountTo: amountFrom * this.getExchangeRate() })
  }

  @boundMethod
  onCurrencyToChange(event: ChangeEvent<HTMLInputElement>): void {
    const amountTo = parseInt(event.target.value, 10)
    this.setState({ amountTo, amountFrom: amountTo * this.getExchangeRate() })
  }

  @boundMethod
  onExchangeClick(): void {
    const { currencyFrom, currencyTo, amountFrom, amountTo } = this.state

    this.props.dispatch(exchangeCurrencies({
      currencyFrom,
      currencyTo,
      amountFrom,
      amountTo,
    }))
  }

  @boundMethod
  previousCurrencyFrom(): void {
    const { currencyFrom } = this.state
    const index = CURRENCIES.indexOf(currencyFrom)
    this.setState({
      currencyFrom: CURRENCIES[(CURRENCIES.length + index - 1) % CURRENCIES.length],
    })
  }

  @boundMethod
  nextCurrencyFrom(): void {
    const { currencyFrom } = this.state
    const index = CURRENCIES.indexOf(currencyFrom)
    this.setState({
      currencyFrom: CURRENCIES[(index + 1) % CURRENCIES.length],
    })
  }

  @boundMethod
  previousCurrencyTo(): void {
    const { currencyTo } = this.state
    const index = CURRENCIES.indexOf(currencyTo)
    this.setState({
      currencyTo: CURRENCIES[(CURRENCIES.length + index - 1) % CURRENCIES.length],
    })
  }

  @boundMethod
  nextCurrencyTo(): void {
    const { currencyTo } = this.state
    const index = CURRENCIES.indexOf(currencyTo)
    this.setState({
      currencyTo: CURRENCIES[(index + 1) % CURRENCIES.length],
    })
  }

  @boundMethod
  getExchangeRate(): number {
    const { exchangeRates } = this.props
    const { currencyTo, currencyFrom } = this.state
    return exchangeRates.rates[currencyTo] / exchangeRates.rates[currencyFrom]
  }

  render(): React.ReactNode {
    const { walletAmounts } = this.props
    const { currencyFrom, currencyTo, amountFrom, amountTo } = this.state
    const exchangeRate = this.getExchangeRate()

    return (
      <div>
        {
          !Number.isNaN(exchangeRate) &&
          <div>{ `1${Symbols[currencyFrom]} = ${this.getExchangeRate()}${Symbols[currencyTo]}` }</div>
        }
        <div>{ `From ${currencyFrom} (You have ${Symbols[currencyFrom]}${walletAmounts[currencyFrom] || 0})` }</div>
        <div>
          <button onClick={this.previousCurrencyFrom}>&lt;</button>
          <button onClick={this.nextCurrencyFrom}>&gt;</button>
        </div>
        <div>
          <input
            type='number'
            name='currencyFrom'
            onChange={this.onCurrencyFromChange}
            value={amountFrom}
          />
        </div>
        <div>{ `To ${currencyTo} (You have ${Symbols[currencyTo]}${walletAmounts[currencyTo] || 0})` }</div>
        <div>
          <button onClick={this.previousCurrencyTo}>&lt;</button>
          <button onClick={this.nextCurrencyTo}>&gt;</button>
        </div>
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
            disabled={Number.isNaN(exchangeRate) || currencyTo === currencyFrom}
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
