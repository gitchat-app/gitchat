import React, { Component } from "react";
import "./Users.scss";

import firebase from "../../../firebase";

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      memberObj: {}
    };
  }

  componentDidMount() {
    const usersRef = firebase.database().ref("users");
    const membersRef = firebase
      .database()
      .ref(`servers/${this.props.serverName}/members`);

    console.log("membersRef", membersRef);

    let memberObj = null;

    membersRef.once("value").then((snap) => {
      //   console.log("snap.val()", snap.val());

      this.setState({ memberObj: snap.val() });
      //   console.log("this.state", this.state);
    });
    // console.log("memberObj", memberObj);
  }

  render() {
    let usernames = [];
    for (let key in this.state.memberObj) {
      usernames.push(<div>{this.state.memberObj[key]}</div>);
    }

    return (
      <div className="users-component">
        <h1>All Users</h1>
        {/* {this.state.members} */}
        {usernames}

        <h1>Online</h1>

        <h1>Offline</h1>
      </div>
    );
  }
}

export default Users;
