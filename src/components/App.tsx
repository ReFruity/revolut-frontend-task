import { Button, Input } from 'antd'
import { boundMethod } from 'autobind-decorator'
import * as React from 'react'
import { ChangeEvent } from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { fetchDataRequest } from 'src/actions/data-actions'
import { exchangeCurrencies } from 'src/actions/wallet-actions'
import config from 'src/config'
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
  inputAmountFrom: string
  inputAmountTo: string
}

const defaultState: State = {
  currencyFrom: Currency.USD,
  currencyTo: Currency.EUR,
  amountFrom: 0,
  amountTo: 0,
  inputAmountFrom: '',
  inputAmountTo: '',
}

function roundToTwoDigits(x: number): number {
  return Math.round(x * 100) / 100
}

function roundToFourDigits(x: number): number {
  return Math.round(x * 10000) / 10000
}

class App extends React.Component<Props, State> {
  state: State = defaultState

  componentDidMount(): void {
    this.props.dispatch(fetchDataRequest())
    setInterval(() => this.props.dispatch(fetchDataRequest()), config.pollIntervalInSeconds * 1000)
  }

  @boundMethod
  onCurrencyFromChange(event: ChangeEvent<HTMLInputElement>): void {
    const { value } = event.target

    const amountFrom = parseFloat(value)

    if (!value || isNaN(amountFrom)) {
      this.setState({
        amountFrom: defaultState.amountFrom,
        amountTo: defaultState.amountTo,
        inputAmountTo: defaultState.inputAmountTo,
        inputAmountFrom: defaultState.inputAmountFrom,
      })
      return
    }

    if (value.match(/^-?\d+\.\d{3}/)) {
      return
    }

    if (value.match(/^-?\d+\.$/) ||
        value.match(/^-$/) ||
        value.match(/^-?\d+\.0$/)) {
      this.setState({ inputAmountFrom: value })
      return
    }

    const amountTo = -amountFrom * this.getExchangeRate()
    const inputAmountFrom = (roundToTwoDigits(amountFrom)).toString()
    const inputAmountTo = (roundToTwoDigits(amountTo)).toString()

    this.setState({
      amountFrom,
      amountTo,
      inputAmountFrom,
      inputAmountTo,
    })
  }

  @boundMethod
  onCurrencyToChange(event: ChangeEvent<HTMLInputElement>): void {
    const { value } = event.target

    const amountTo = parseFloat(value)

    if (!value || isNaN(amountTo)) {
      this.setState({
        amountFrom: defaultState.amountFrom,
        amountTo: defaultState.amountTo,
        inputAmountTo: defaultState.inputAmountTo,
        inputAmountFrom: defaultState.inputAmountFrom,
      })
      return
    }

    if (value.match(/^-?\d+\.\d{3}/)) {
      return
    }

    if (value.match(/^-?\d+\.$/) ||
      value.match(/^-$/) ||
      value.match(/^-?\d+\.0$/)) {
      this.setState({ inputAmountTo: value })
      return
    }

    const amountFrom = -amountTo * this.getExchangeRate()
    const inputAmountFrom = (roundToTwoDigits(amountFrom)).toString()
    const inputAmountTo = (roundToTwoDigits(amountTo)).toString()

    this.setState({
      amountFrom,
      amountTo,
      inputAmountFrom,
      inputAmountTo,
    })
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
    const { currencyFrom, currencyTo, inputAmountFrom, inputAmountTo } = this.state
    const exchangeRate = this.getExchangeRate()

    return (
      <div className='root'>
        {
          !Number.isNaN(exchangeRate) &&
          <div className='exchangeRate'>
            { `1${Symbols[currencyFrom]} = ${roundToFourDigits(this.getExchangeRate())}${Symbols[currencyTo]}` }
          </div>
        }
        <div className='from'>
          <Button onClick={this.previousCurrencyFrom}>&lt;</Button>
          <div className='fromText'>
            { `From ${currencyFrom} (You have ${Symbols[currencyFrom]}${roundToTwoDigits(walletAmounts[currencyFrom] || 0)})` }
          </div>
          <Button onClick={this.nextCurrencyFrom}>&gt;</Button>
        </div>
        <div className='inputWrap'>
          <Input
            type='string'
            name='currencyFrom'
            onChange={this.onCurrencyFromChange}
            value={inputAmountFrom}
          />
        </div>
        <div className='to'>
          <Button onClick={this.previousCurrencyTo}>&lt;</Button>
          <div className='fromText'>
            { `To ${currencyTo} (You have ${Symbols[currencyTo]}${roundToTwoDigits(walletAmounts[currencyTo] || 0)})` }
          </div>
          <Button onClick={this.nextCurrencyTo}>&gt;</Button>
        </div>
        <div className='inputWrap'>
          <Input
            type='string'
            name='currencyTo'
            onChange={this.onCurrencyToChange}
            value={inputAmountTo}
          />
        </div>
        <div>
          <Button
            type='primary'
            disabled={Number.isNaN(exchangeRate) || currencyTo === currencyFrom}
            onClick={this.onExchangeClick}
          >
            Exchange
          </Button>

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
