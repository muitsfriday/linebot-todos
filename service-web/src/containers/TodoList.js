/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import TodoItem from './TodoItem'
import { dateFormat } from '../helpers/time'

class TodoList extends Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div className="list-group">
      {
        this.props.todos.map(item => (
          <TodoItem
            key={item._id}
            id={item._id}
            task={item.task}
            done={item.done}
            date={dateFormat(item.dueDate)}
            important={item.important} />
        ))
      }
      </div>
    )
  }
}

export default connect(state => ({
  todos: Object.values(state.todo.list),
}))(TodoList)
