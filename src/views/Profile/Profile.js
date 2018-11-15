import React, { Component } from "react";
import "./Profile.scss";
import firebase from "../../firebase";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      avatar: "",
      username: "",
      name: "",
      email: "",
      edit: false
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          console.log("user:", user);
          const ref = firebase.database().ref(`users/${user.uid}`);
          ref.on("value", snapshot => {
            console.log("snapshot:", snapshot.val());
            this.setState({ user: snapshot.val() });
            this.setState({ avatar: snapshot.val().avatar })
            this.setState({ username: snapshot.val().username })
            this.setState({ name: snapshot.val().name })
            this.setState({ email: snapshot.val().email })
          });
        } else {
          // No user is logged in.
          console.log("No user logged in");
        }
      }.bind(this)
    );
  }

  render() {
    // const uid = this.state.user.uid;
    // console.log('uid: ', uid);
    
    return (
      <div className="profile">
        <h1>Profile</h1>
        <br />
        {this.state.edit === false ? (
          <>
            <br />
            {/* <img src={this.state.user.avatar} alt="avatar_image" /> */}
            <h3>{this.state.user.username}</h3>
            <br />
            <h3> {this.state.user.name} </h3>
            <h3>{this.state.user.email}</h3>
            <br />
            <button onClick={() => this.setState({ edit: true })}>
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <h3>Avatar URL</h3>
            <input
              value={this.state.avatar}
              placeholder="Avatar"
              onChange={e => this.setState({ avatar: e.target.value })}
            />
            {/* USER ENTERED URL input: 
            https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50 
            */}

            <h3>username</h3>
            <input
              value={this.state.username}
              placeholder="Username"
              onChange={e => this.setState({ username: e.target.value })}
            />

            <h3>name</h3>
            <input
              value={this.state.name}
              placeholder="Name"
              onChange={e => this.setState({ name: e.target.value })}
            />

            <h3>email</h3>
            <input
              value={this.state.email}
              placeholder="email"
              onChange={e => this.setState({ email: e.target.value })}
            />

            <button onClick={e => this.setState({ edit: false })}>
              Cancel
            </button>
            <div>
              <button
                onClick={() => {
                  firebase
                    .database()
                    .ref("users/" + this.state.user.uid)
                    .update({
                      avatar: this.state.avatar,
                      username: this.state.username,
                      name: this.state.name,
                      email: this.state.email
                    });
                }}
              >
                Save Changes
              </button>
            </div>

            <div>
              {/* <button onClick={() => userId.delete()}>
                Delete Account
              </button> */}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Profile;
