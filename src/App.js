import React, { Component } from "react"
import logo from "./logo.svg"
import "./App.scss"
import firebase from "./firebase"

class App extends Component {
  componentDidMount() {
    console.log(firebase.database())

    const usersRef = firebase.database().ref("users")

    const testUser = {
      username: "testing"
    }

    // usersRef.push(testUser)
    console.log("usersRef", usersRef)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Initial Setup</p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    )
  }
}

export default App
