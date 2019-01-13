import React, { Component } from 'react'
import TodoList from './TodoList'
import More from './More'

class App extends Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm"><h1>Edit Todo List</h1></div>
        </div>
        <div className="row">
          <TodoList />
        </div>
        <div className="row text-center">
          <More />
        </div>
      </div>
    )
  }
}


export default App
