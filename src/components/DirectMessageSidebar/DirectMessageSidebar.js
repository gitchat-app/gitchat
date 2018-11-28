import React, { Component } from "react";
import "./DirectMessageSidebar.scss";

import firebase from "../../firebase";

import { NavLink } from "react-router-dom";

class DirectMessageSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openDMs: {},
      links: []
    };

    this.mapLinks = this.mapLinks.bind(this);

    this.mountFunction = this.mountFunction.bind(this);
  }

  mapLinks() {
    // console.log("IN MAP LINKS this.state", this.state);

    let newLinks = this.state.links;
    let keysArr = [];

    for (let key in this.state.openDMs) {
      keysArr.push(key);

      firebase
        .database()
        .ref(`users/${key}`)
        .once("value", (snap) => {
          // console.log("snap.val()", snap.val().username);

          let newLink = (
            <NavLink
              to={`/direct/${key}`}
              className="dm-link"
              activeClassName="dm-link-selected"
              key={key}
            >
              Message {snap.val().username}
            </NavLink>
          );

          newLinks.push(newLink);

          // console.log("keysArr", keysArr);

          this.setState({ links: newLinks });
        });
    }
  }

  mountFunction() {
    // console.log("MOUNT FUNC");
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          let userDMsRef = firebase.database().ref(`users/${user.uid}/dms`);

          userDMsRef
            .once("value", (snap) => {
              // console.log("snap.val()", snap.val());
              this.setState({ openDMs: snap.val() });
            })
            .then(() => {
              // console.log("THEN");
              this.setState({ links: [] });
              this.mapLinks();
            });
        } else {
          // No user is signed in.
        }
      }.bind(this)
    );
  }

  componentDidMount() {
    this.mountFunction();
  }

  render() {
    let linkMap = [];

    this.state.links.forEach((e, i, arr) => {
      linkMap.push(
        <div className="dm-link-div" key={i}>
          {e}
        </div>
      );
    });

    // console.log("RENDERING this.state", this.state);
    return (
      // <NavLink>Dashboard</NavLink>

      <div className="dm-sidebar">
        <div id="dm-sidebar-header">
          <h2>Direct Messages</h2>
        </div>
        <div>{linkMap}</div>
      </div>
    );
  }
}

export default DirectMessageSidebar;
