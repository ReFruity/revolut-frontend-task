import { DataState, ExchangeRates, FETCH_DATA_ERROR, FETCH_DATA_SUCCESS, FetchDataTypes } from 'src/types/data-types'

export const initialState: DataState = {
  exchangeRates: {
    base: '',
    rates: {},
  },
}

export default function dataReducer(
  state = initialState,
  action: FetchDataTypes,
): DataState {
  switch (action.type) {
    case FETCH_DATA_SUCCESS:
      return {
        exchangeRates: {
          ...action.payload,
        },
      }
    case FETCH_DATA_ERROR:
      return initialState
    default:
      return state
  }
}
