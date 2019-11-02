import { boundMethod } from 'autobind-decorator'
import * as React from 'react'
import { ChangeEvent } from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { fetchDataRequest } from 'src/actions/data-actions'
import { Currency } from 'src/constants/currency-constants'
import { DataState, ExchangeRates } from 'src/types/data-types'

interface Props {
  exchangeRates: ExchangeRates
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

  render(): React.ReactNode {
    const { exchangeRates } = this.props
    const { currencyFrom, currencyTo, amountFrom, amountTo } = this.state

    return (
      <div>
        <div>{ exchangeRates.rates[currencyTo] }</div>
        <div>{ currencyFrom }</div>
        <div>
          <input
            type='number'
            name='currencyFrom'
            onChange={this.onCurrencyFromChange}
            value={amountFrom}
          />
        </div>
        <div>{ currencyTo }</div>
        <div>
          <input
            type='number'
            name='currencyTo'
            onChange={this.onCurrencyToChange}
            value={amountTo}
          />
        </div>
        <div>{ (amountFrom * exchangeRates.rates[Currency.EUR]).toString() }</div>
      </div>
    )
  }
}

const mapStateToProps = (state: DataState) => {
  return {
    exchangeRates: state.exchangeRates,
  }
}

export default connect(mapStateToProps)(App)
