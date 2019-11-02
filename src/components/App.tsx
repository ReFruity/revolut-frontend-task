import * as React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { fetchDataRequest } from 'src/actions/data-actions'

interface Props {
  dispatch: (action: Action) => void
}

class App extends React.Component<Props> {
  render(): React.ReactNode {
    this.props.dispatch(fetchDataRequest())

    return <h1>Hello there!</h1>
  }
}

export default connect()(App)
