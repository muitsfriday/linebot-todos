/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadMore } from '../ducks/todo'

class More extends Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    if (this.props.more) {
      return (
        <button type="button" className="btn btn-light" onClick={ () => this.props.loadMore() }>more</button>
      )
    }
    return null
  }
}


export default connect(state => ({
  more: state.todo.more,
}), { loadMore })(More)
