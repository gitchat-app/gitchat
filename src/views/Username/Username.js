import React, { Component } from "react";
import firebase from "../../firebase";
import firebaseui from "firebaseui";

class Username extends Component {
  constructor() {
    super();
    this.state = {
      username: ""
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("user", user);
        // User is signed in.
      } else {
        // No user is signed in.
      }
    });
  }

  createUser = () => {
    const user = firebase.auth().currentUser;
    const authRef = firebase.database();
    authRef.ref(`users/${user.uid}`).once("value", snapshot => {
      if (!snapshot.val()) {
        authRef.ref(`users/${user.uid}`).set({
          name: user.displayName,
          uid: user.uid,
          email: user.email,
          username: this.state.username,
          avatar:
            "http://laurauinteriordesign.com/wp-content/uploads/2018/03/avatar-placeholder.png"
        });
      }
    });
    authRef.ref(`usernames/${this.state.username}`).once("value", snapshot => {
      authRef.ref(`usernames/${this.state.username}`).set(user.uid);
    });
    this.props.history.push("/dashboard");
  };

  render() {
    // console.log(firebase.auth().currentUser.displayName)
    console.log(this.props)
    return (
      <div>
        <h1>username:</h1>
        {this.state.username}
        <input
          value={this.state.username}
          onChange={e => this.setState({ username: e.target.value })}
        />
        <button onClick={() => this.createUser()}>Add user name </button>
      </div>
    );
  }
}

export default Username;
