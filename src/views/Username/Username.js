import React, { Component } from "react";
import firebase from "../../firebase";
import ReactModal from "react-modal";
import "./Username.scss";

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
        // console.log("user", user);
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
      // console.log(url);
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
    // console.log(this.props);
    return (
      <div id="username-modal">
        <ReactModal
          isOpen={true}
          contentLabel="server-modal"
          className="UsernameModal"
          appElement={document.getElementById("username-modal")}
          overlayClassName="UsernameOverlay">
          <div 
            className="username-content">
            <h1>To complete signup:</h1> 
            <div className="username-input-cont">
              <label>Create your own display name:</label>
              <input
                required
                value={this.state.username}
                onChange={(e) => this.setState({ username: e.target.value })}
              />
            </div>
            <div className="username-input-cont">
              <label>Upload custom avatar url:</label>
              <input
                type="text"
                className="avatar-url"
                required
                value={this.state.avatar}
                onChange={e => this.setState({ avatar: e.target.value })}
              />
            </div>
            <input
              type="file"
              id="uploader"
              onChange={e => this.uploadImage(e)}
            />
            <button
              type="submit"
              disabled={this.state.username && this.state.avatar === "" ? true : false}
              onClick={() => this.createUser()}
            >Create User
            </button>
          </div>
        </ReactModal>
      </div>
    );
  }
}

export default Username;
