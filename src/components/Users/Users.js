import React, { Component } from "react";
import "./Users.scss";

import firebase from "../../firebase";

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onlineUsers: []
    };

    this.getUsers = this.getUsers.bind(this);
  }

  getUsers() {
    const onlineUsersRef = firebase.database().ref("onlineUsers");
    const membersRef = firebase
      .database()
      .ref(`servers/${this.props.serverName}/members`);

    membersRef.on("value", (snap) => {
      this.setState({ members: snap.val() });
    });

    onlineUsersRef.on("value", (snap) => {
      // console.log("snap.val()", snap.val());

      let keys = Object.keys(snap.val());
      console.log("keys", keys);

      this.setState({ onlineUsers: keys });
    });
  }

  componentDidMount() {
    this.getUsers();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      console.log("NEW PROPS");
      console.log("this.props", this.props);

      this.getUsers();
    }
  }

  render() {
    let onlineList = [];
    let offlineList = [];
    for (let key in this.state.members) {
      if (this.state.onlineUsers.includes(key)) {
        console.log("they're online");
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
        console.log("they're offline");
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
