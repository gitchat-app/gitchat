import React, { Component } from "react";
import "./DirectMessages.scss";

import DirectMessageSidebar from "../../components/DirectMessageSidebar/DirectMessageSidebar";
import DMChat from "../../components/DMChat/DMChat";

import firebase from "../../firebase";

class DirectMessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // currentUserId: null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      console.log("NEW PROPS");
      console.log("this.props", this.props);
      // this.setState

      // this.mountFunction();
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          // console.log("user", user);
          console.log("this.props", this.props);

          this.setState({ currentUserId: user.uid });
        } else {
          console.log("NO USER");
        }
      }.bind(this)
    );
  }

  render() {
    console.log("this.state", this.state);
    console.log("re-rendering DM VIEW");
    return (
      <div className="dm-component">
        <DirectMessageSidebar />

        <DMChat currentUrlParams={this.props.match.params.id} />
      </div>
    );
  }
}

export default DirectMessages;
