/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleDone, toggleImportant } from '../ducks/todo'

class TodoItem extends Component {
  constructor(props) {
    super(props)
    this.changeDone = this.changeDone.bind(this)
    this.state = {
      checked: this.props.done,
    }
  }

  changeDone(id, done) {
    if (this.state.checked !== this.props.done) {
      return
    }
    this.setState({
      checked: !done,
    })
    this.props.toggleDone(id, done)
  }

  changeImportant(id, important) {
    console.log('changeImportant', id, important)
    this.setState({
      checked: !important,
    })
    this.props.toggleImportant(id, important)
  }

  render() {
    return (
      <div className="list-group-item list-group-item-action">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">{ this.props.task }</h5>
          <small onClick={ () => this.changeImportant(this.props.id, this.props.important) } >
            <i className={ this.props.important ? 'fas fa-star important' : 'far fa-star' } />
          </small>
        </div>
        <p className="mb-1">
          state:
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={ `done-${this.props.id}` } onClick={ () => this.changeDone(this.props.id, this.props.done) } checked={ this.state.checked ? 'checked' : '' } />
            <label className="form-check-label" htmlFor={ `done-${this.props.id}` } >
              { this.props.done ? 'complete' : 'incomplete' }
            </label>
          </div>
        </p>
        <small>{ this.props.date }</small>
      </div>
    )
  }
}

export default connect(null, { toggleDone, toggleImportant })(TodoItem)
