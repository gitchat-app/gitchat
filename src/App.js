import React, { Component } from "react";
import ServerNav from "./components/ServerNav/ServerNav";
import firebase from "./firebase";
import { BrowserRouter } from "react-router-dom";
import routes from "./routes";
import "./App.scss";

class App extends Component {
  componentDidMount() {
    firebase
      .auth()
      .onAuthStateChanged(user => {
        if (!user) {
          // this.props.history.push('/login');
        } else {
      console.log(user);
        let connectedRef = firebase.database().ref(".info/connected");
        let onlineRef = firebase.database().ref(`onlineUsers/${user.uid}`);
        let userRef = firebase.database().ref(`users/${user.uid}/status`);
        connectedRef.on("value", snap => {
          if (snap.val() === true) {
            let sessionRef = firebase.database().ref(`users/${user.uid}`);
            console.log("connected");
            onlineRef.onDisconnect().remove();
            onlineRef.set(true);
            userRef.set('online');
            userRef.onDisconnect().set("offline");
            sessionRef.child('ended').onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
            sessionRef.child('began').set(firebase.database.ServerValue.TIMESTAMP);
          } else {
            console.log("not connected");
          }
        });
        }
      });
  }
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <ServerNav />
          {routes}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
