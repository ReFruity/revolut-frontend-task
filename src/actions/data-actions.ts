import { FETCH_DATA_REQUEST, FetchDataRequestAction } from 'src/types/data-types'
import { FETCH_DATA_ERROR, FETCH_DATA_SUCCESS, FetchDataErrorAction, FetchDataSuccessAction } from 'src/types/data-types'
import { ExchangeRates } from 'src/types/data-types'

export function fetchDataRequest(): FetchDataRequestAction {
  return {
    type: FETCH_DATA_REQUEST,
  }
}

export function fetchDataSuccess(payload: ExchangeRates): FetchDataSuccessAction {
  return {
    type: FETCH_DATA_SUCCESS,
    payload,
  }
}

export function fetchDataError(message: string): FetchDataErrorAction {
  return {
    type: FETCH_DATA_ERROR,
    message,
  }
}
