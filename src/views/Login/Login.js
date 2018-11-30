import React, { Component } from "react";
import "./Login.scss";
import firebase from "../../firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import ReactModal from "react-modal";

class Login extends Component {
  uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // console.log(authResult, redirectUrl);
        if (authResult.additionalUserInfo.isNewUser === true) {
          return true;
        } else {
          window.location.assign(
            "https://gitchat-app.firebaseapp.com/dashboard"
          );
        }
      }
    },
    signInFlow: "popup",
    signInSuccessUrl: "https://gitchat-app.firebaseapp.com/username",
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ]
  };

  render() {
    return (
      // <div className="isAuth">
      <ReactModal
        isOpen={true}
        // contentLabel="LoginModal"}
        className="login-modal"
        // appElement={document.getElementById("isAuth")}
        overlayClassName="login-overlay"
      >
        <div>
          <p>Login via Firebase Auth</p>
          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
      </ReactModal>
      // </div>
    );
  }
}

export default Login;
