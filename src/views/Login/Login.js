import React, { Component } from "react";
import "./Login.scss";
import firebase from "../../firebase";
import firebaseui from "firebaseui";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

class Login extends Component {
  uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        console.log(authResult, redirectUrl);
        if (authResult.additionalUserInfo.isNewUser === true) {
          return true;
        } else {
          window.location.assign("http://localhost:3000/dashboard");
        }
      }
    },
    signInFlow: "popup",
    signInSuccessUrl: 'http://localhost:3000/username',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ]
  };

  
  render() {
    return (
      <div className="isAuth">
        <StyledFirebaseAuth
          uiConfig={this.uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    );
  }
}

export default Login;
