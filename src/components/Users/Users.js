import React, { Component } from "react";
import "./Users.scss";
import ReactModal from "react-modal";

import { Link } from "react-router-dom";

import firebase from "../../firebase";

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onlineUsers: [],
      modalOpen: false
    };

    this.getUsers = this.getUsers.bind(this);
    this.joinServer = this.joinServer.bind(this);
    this.inviteFriends = this.inviteFriends.bind(this);

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  joinServer() {
    console.log("join clicked");
    console.log("this.state", this.state);
    let membersRef = firebase
      .database()
      .ref(
        `servers/${this.props.serverName}/members/${this.props.currentUser.uid}`
      );

    membersRef.set(this.state.currentUsername);

    let userRef = firebase
      .database()
      .ref(
        `users/${this.props.currentUser.uid}/servers/${this.props.serverName}`
      );

    userRef.set(true);

    this.setState({ isMember: true });
  }

  inviteFriends() {
    console.log("invite clicked");
    this.toggleModal();
  }

  getUsers() {
    const onlineUsersRef = firebase.database().ref("onlineUsers");
    const membersRef = firebase
      .database()
      .ref(`servers/${this.props.serverName}/members`);

    const userMemberRef = firebase
      .database()
      .ref(
        `servers/${this.props.serverName}/members/${this.props.currentUser.uid}`
      );

    userMemberRef.once("value", (snap) => {
      if (snap.exists()) {
        console.log("is member");
        this.setState({ isMember: true });
      } else {
        console.log("not member");
        this.setState({ isMember: false });
      }
    });

    membersRef.on("value", (snap) => {
      this.setState({ members: snap.val() });
    });

    onlineUsersRef.on("value", (snap) => {
      // console.log("snap.val()", snap.val());

      let keys = Object.keys(snap.val());
      // console.log("keys", keys);

      this.setState({ onlineUsers: keys });
    });

    let userRef = firebase
      .database()
      .ref(`users/${this.props.currentUser.uid}/username`);
    userRef.once("value", (snap) => {
      // console.log("snap.val()", snap.val());
      this.setState({ currentUsername: snap.val() });
    });
  }

  componentDidMount() {
    this.getUsers();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      console.log("NEW PROPS");
      // console.log("this.props", this.props);

      this.getUsers();
    }
  }

  render() {
    // console.log("this.props", this.props);
    // console.log("this.state", this.state);

    let onlineList = [];
    let offlineList = [];
    for (let key in this.state.members) {
      if (this.state.onlineUsers.includes(key)) {
        // console.log("they're online");
        let colorStatus = "#e0e0e0";

        let singleUser = (
          <div className="user-list-item" key={key}>
            <div
              style={{ background: colorStatus }}
              className="online-status-color"
            />
            <p>{this.state.members[key]}</p>
            {/* <img src={[key].avatar} alt="" /> */}
          </div>
        );
        // console.log("singleUser", singleUser);

        onlineList.push(singleUser);
      } else {
        // console.log("they're offline");
        let colorStatus = "#5a7164";

        let singleUser = (
          <div className="user-list-item" key={key}>
            <div
              style={{ background: colorStatus }}
              className="online-status-color"
            />
            <p>{this.state.members[key]}</p>
            {/* <img src={[key].avatar} alt="" /> */}
          </div>
        );
        // console.log("singleUser", singleUser);

        offlineList.push(singleUser);
      }
    }

    return (
      <div className="users-component">
        {this.state.modalOpen ? (
          <ReactModal
            isOpen={true}
            className="users-modal"
            overlayClassName="users-modal-overlay"
          >
            <div>
              <button
                className="close-button"
                onClick={() => {
                  this.toggleModal();
                }}
              >
                Close
              </button>
              <div>
                <div> Send your friend this link:</div>
                {/* <Link to={`/server/${this.props.serverName}`}> */}
                https://gitchat-app.firebaseapp.com/server/
                {this.props.serverName}
                {/* </Link> */}
              </div>
            </div>
          </ReactModal>
        ) : null}

        {this.state.isMember ? (
          <div>
            <button onClick={() => this.inviteFriends()}>Invite Friends</button>
          </div>
        ) : (
          <div>
            <button onClick={() => this.joinServer()}>Join Server</button>
          </div>
        )}

        <div className="online">
          <h1>Online</h1>
          {onlineList}
        </div>

        <div className="offline">
          <h1>Offline</h1>
          <div> {offlineList}</div>
        </div>
      </div>
    );
  }
}

export default Users;
