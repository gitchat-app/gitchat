import React, { Component } from "react";
import "./DirectMessageSidebar.scss";

import firebase from "../../firebase";

import { NavLink } from "react-router-dom";

class DirectMessageSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openDMs: {}
    };
  }

  componentDidMount() {}
  render() {
    return (
      <div className="dmSidebar">
        <h1>DM Sidebar</h1>
        <NavLink to="/direct/test1">Test 1</NavLink>
        <NavLink to="/direct/test2">Test 2</NavLink>
      </div>
    );
  }
}

export default DirectMessageSidebar;
