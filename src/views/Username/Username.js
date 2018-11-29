import React, { Component } from "react";
import firebase from "../../firebase";
import firebaseui from "firebaseui";

class Username extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      avatar: ""
    };
    this.uploadImage = this.uploadImage.bind(this);
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

  async uploadImage() {
    let uploader = document.getElementById('uploader').files[0];
    let fileRef = firebase.storage().ref(`user_avatars/${uploader.name}`);
    await fileRef.put(uploader);
    await fileRef.getDownloadURL().then(url => {
      console.log(url);
      this.setState({ avatar: url });
    });
  }

  createUser = () => {
    const user = firebase.auth().currentUser;
    const authRef = firebase.database();
    let img = this.state.avatar 
    ? this.state.avatar 
    : "http://laurauinteriordesign.com/wp-content/uploads/2018/03/avatar-placeholder.png"
    authRef.ref(`users/${user.uid}`).once("value", (snapshot) => {
      if (!snapshot.val().username) {
        authRef.ref(`users/${user.uid}`).set({
          name: user.displayName,
          uid: user.uid,
          email: user.email,
          username: this.state.username,
          avatar: img,
          servers: { "-LSRXkbdM4Ny08d-3m0k": "Global Server" }
        });
      }
    });
    authRef
      .ref(`usernames/${this.state.username}`)
      .once("value", (snapshot) => {
        authRef.ref(`usernames/${this.state.username}`).set(user.uid);
      });
    this.props.history.push("/dashboard");
  };

  render() {
    console.log(this.props);
    return (
      <div>
        <h1>Create your username</h1>
        <input
          value={this.state.username}
          onChange={(e) => this.setState({ username: e.target.value })}
        />
        <p>Upload custom avatar</p>
        <input
          type="file"
          id="uploader"
          onChange={e => this.uploadImage(e)}
        />
        <button
          disabled={this.state.username === "" ? true : false}
          onClick={() => this.createUser()}
        >
          Create user
        </button>
      </div>
    );
  }
}

export default Username;
