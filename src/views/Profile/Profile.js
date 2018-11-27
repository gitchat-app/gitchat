import React, { Component } from "react";
import "./Profile.scss";
import firebase from "../../firebase";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      uid: "",
      avatar: "",
      username: "",
      name: "",
      email: "",
      edit: false
    };
    this.uploadImage = this.uploadImage.bind(this);
  }

  async uploadImage(e) {
    let uploader = document.getElementById("uploader").files[0];
    let fileRef = firebase.storage().ref(`user_avatars/${uploader.name}`);
    await fileRef.put(uploader);
    await fileRef.getDownloadURL().then(url => {
      console.log(url);
      this.setState({ avatar: url });
    });
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(
      function(user) {
        console.log(user);
        if (user) {
          const ref = firebase.database().ref(`users/${user.uid}`);
          ref.on("value", snapshot => {
            console.log("snapshot:", snapshot.val());
            this.setState({ user: snapshot.val() });
            this.setState({ uid: snapshot.val().uid });
            this.setState({ avatar: snapshot.val().avatar });
            this.setState({ username: snapshot.val().username });
            this.setState({ name: snapshot.val().name });
            this.setState({ email: snapshot.val().email });
          });
        } else {
          // No user is logged in.
          console.log("No user logged in");
        }
      }.bind(this)
    );
  }

  render() {
    const uid = firebase.database();
    console.log(uid);

    return (
      <div className="profile">
        <br />
        {this.state.edit === false ? (
          <>
            <img
              className="avatar-img"
              src={this.state.avatar}
              alt=""
              onError={
                e =>
                  (e.target.src =
                    "http://laurauinteriordesign.com/wp-content/uploads/2018/03/avatar-placeholder.png") // use this.state.imgurl doesn't lead to an img
              }
            />
            <br />
            <h3>{this.state.user.username}</h3>
            <br />
            <h3> {this.state.user.name} </h3>
            <br />
            <h3>{this.state.user.email}</h3>
            <br />
            <button onClick={() => this.setState({ edit: true })}>
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <img
              className="avatar-img"
              src={this.state.avatar}
              alt=""
              onError={
                e =>
                  (e.target.src =
                    "http://laurauinteriordesign.com/wp-content/uploads/2018/03/avatar-placeholder.png") // use this.state.imgurl doesn't lead to an img
              }
            />
            <br />

            <form className="editProfile">
              <p>
                <label>Photo/Avatar URL: </label>
                <input
                  type="file"
                  id="uploader"
                  required
                  onChange={e => this.uploadImage(e)}
                />
              </p>
              <p>
                <label>Display name: </label>
                <input
                  value={this.state.username}
                  placeholder="Display name..."
                  required
                  onChange={e => this.setState({ username: e.target.value })}
                />
              </p>
              <p>
                <label>Name: </label>
                <input
                  value={this.state.name}
                  placeholder="Name..."
                  required
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </p>
              <p>
                <label>Email: </label>
                <input
                  value={this.state.email}
                  placeholder="email..."
                  required
                  onChange={e => this.setState({ email: e.target.value })}
                />
              </p>
            </form>

            <br />
            <br />
            <button onClick={e => this.setState({ edit: false })}>
              Cancel
            </button>
            <br />
            <div>
              <button
                required
                onClick={() => {
                  firebase
                    .database()
                    .ref("users/" + this.state.uid)
                    .update({
                      avatar: this.state.avatar,
                      username: this.state.username,
                      name: this.state.name,
                      email: this.state.email
                    });
                  this.setState({
                    edit: false
                  });
                }}
              >
                Save Changes
              </button>
            </div>
            <br />
          </>
        )}
      </div>
    );
  }
}

export default Profile;
