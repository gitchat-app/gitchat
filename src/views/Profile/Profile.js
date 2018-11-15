import React, { Component } from "react";
import "./Profile.scss";
import firebase from "../../firebase";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: {}
    };
  }

  // getUserInfo = () => {
  //   const userInfo = firebase.database().ref('users/', uid).set({
  //     avatar: avatar,
  //     email: email,
  //     username: username
  //   });
  // }

  render() {
    const user = firebase.auth().currentUser;
    // const avatar = firebase.auth()
    // const email = firebase.auth()
    // const uid =
    // const username:

    return (
      <div>
        <h1>Profile</h1>

        <h3>Full Name</h3>
        <input value={user} placeholder="full name" />

        <h3>user name</h3>
        <h3>Email</h3>
        <h3>Password</h3>
        <button>Change password</button>
        <h3>Time zone</h3>
        <h4>Delete Account</h4>
        <button>Cancel</button>
        <button>Save Changes</button>
      </div>
    );
  }
}

export default Profile;
