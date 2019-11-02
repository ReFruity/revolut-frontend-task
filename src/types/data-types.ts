export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST'
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS'
export const FETCH_DATA_ERROR = 'FETCH_DATA_ERROR'

export interface FetchDataRequestAction {
  type: typeof FETCH_DATA_REQUEST
}

export interface FetchDataSuccessAction {
  type: typeof FETCH_DATA_SUCCESS,
  payload: ExchangeRates
}

export interface FetchDataErrorAction {
  type: typeof FETCH_DATA_ERROR,
  message: string
}

export type FetchDataTypes = FetchDataSuccessAction | FetchDataErrorAction

export interface ExchangeRates {
  base: string
  rates: { [currency: string]: string }
}

export interface DataState {
  exchangeRates: ExchangeRates
}
