import React, { Component } from "react";
import "./Users.scss";

import firebase from "../../firebase";

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allMembers: {}
    };
  }

  componentDidMount() {
    const usersRef = firebase.database().ref("users");
    const membersRef = firebase
      .database()
      .ref(`servers/${this.props.serverName}/members`);

    membersRef.once("value").then((snap) => {
      //   console.log("snap.val()", snap.val());

      this.setState({ allMembers: snap.val() });
    });
  }

  render() {
    let usernames = [];
    for (let key in this.state.allMembers) {
      usernames.push(<div key={key}>{this.state.allMembers[key]}</div>);
    }

    return (
      <div className="users-component">
        <h1>All Users</h1>
        {usernames}

        <h1>Online</h1>

        <h1>Offline</h1>
      </div>
    );
  }
}

export default Users;
