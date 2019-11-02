import { SagaIterator } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import { fetchDataError, fetchDataSuccess } from 'src/actions/data-actions'
import config from 'src/config'
import { FETCH_DATA_REQUEST } from 'src/types/data-types'
import { ExchangeRates } from 'src/types/data-types'

function* fetchData() {
  try {
    const result = yield call(fetch, `https://openexchangerates.org/api/latest.json?app_id=${config.appId}`)
    const reader = result.body.getReader()
    const { value } = yield reader.read()
    const text = new TextDecoder('utf-8').decode(value)
    const exchangeRates: ExchangeRates = JSON.parse(text)
    yield put(fetchDataSuccess(exchangeRates))
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    yield put(fetchDataError(error.message))
  }

}

export default function*(): SagaIterator {
  yield takeLatest(FETCH_DATA_REQUEST, fetchData)
}
