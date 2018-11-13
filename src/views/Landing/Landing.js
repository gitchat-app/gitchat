import React, { Component } from "react";
import * as routes from "../../routes";
import { Link } from 'react-router-dom';
import "./Landing.scss";
import firebase from "../../firebase";
import firebaseui from "firebaseui";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

class Landing extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      isAuth: false,
      fullname: ''
    };
  }

  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ]
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      // if user exists, set to true, else false 
      // ! converts to boolean
      this.setState({ isAuth: !!user });
      this.setState({ fullname: firebase.auth().currentUser.displayName }); 
      console.log("user", user);
    });
  }

  render() {
    return (
      <div className="isAuth">
        {this.state.isAuth ? (
          <div>
            <h1> Welcome {firebase.auth().currentUser.displayName} </h1>
            <img
              alt="profile_picture"
              src={firebase.auth().currentUser.photoURL}
            />
            <br />
            <div> You are Authorized & Signed In </div>
            <br />
            <button onClick={() => firebase.auth().signOut()}> 
              Sign out! 
              </button>
          </div>
        ) : (
          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}
          />
        )}
      </div>
    );
  }
}

export default Landing;
