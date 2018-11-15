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

    this.setState({ links: [] });

    for (let key in this.state.openDMs) {
      // console.log("key", key);

      let newLinks = this.state.links;

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
            >
              Message {snap.val().username}
            </NavLink>
          );

          newLinks.push(newLink);

          this.setState({ links: newLinks });
        });
    }
  }

  mountFunction() {
    // console.log("MOUNT FUNC");
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          // console.log("user", user);
          // User is signed in.

          let userDMsRef = firebase.database().ref(`users/${user.uid}/dms`);

          userDMsRef.on("value", (snap) => {
            // console.log("snap.val()", snap.val());
            this.setState({ openDMs: snap.val() });
            this.mapLinks();
          });

          // console.log("this.state", this.state);

          this.mapLinks();
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
      linkMap.push(<div className="dm-link-div">{e}</div>);
    });

    // console.log("RENDERING this.state", this.state);
    // console.log("this.state.links", this.state.links);
    return (
      <div className="dm-sidebar">
        <h1>DM Sidebar</h1>
        <h1>Link to /dash here???</h1>
        {linkMap}
      </div>
    );
  }
}

export default DirectMessageSidebar;
