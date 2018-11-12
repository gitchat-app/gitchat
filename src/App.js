import React, { Component } from "react";
import "./App.scss";
import firebase, { auth, provider } from "./firebase";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import routes from "./routes";
import store from "./ducks/store";

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    }
  }

  componentDidMount() {
    // console.log(firebase.database());

    // const usersRef = firebase.database().ref("users");
    // const testUser = {
    //   username: "testing"
    // };

    // usersRef.push(testUser)
    // console.log("usersRef", usersRef);
  }

  render() {
    return (
      // <Provider store={store}>

        <BrowserRouter>
          <div className="App">{routes}</div>
        </BrowserRouter>

    );
  }
}

export default App;
