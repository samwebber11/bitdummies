import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Add a proxy to client's package.json with text:
          "http://localhost:PORT"
        </p>
        <p>Here PORT will be the port that backend is running on. (3001)</p>
      </div>
    )
  }
}

export default App
