import React, { Component } from "react";
import "./Servers.scss";

import firebase from "../../firebase";
import Channels from "./components/Channels";
import Chat from "../../components/Chat/Chat";

class Servers extends Component {
  constructor() {
    super();

    this.state = {
      currentChannelName: "null",
      currentChannelSubtitle: "",
      server: {
        name: ""
      },
      user: {}
    };

    this.changeChannel = this.changeChannel.bind(this);
  }

  changeChannel(newChannel) {
    // console.log("newChannel", newChannel);
    this.setState({
      currentChannelName: newChannel.name,
      currentChannelSubtitle: newChannel.subtitle
    });
    // console.log("this.state", this.state);
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      // console.log("NEW PROPS");
      let serverRef = firebase
        .database()
        .ref(`servers/${this.props.match.params.id}`);
      serverRef.once("value").then((snap) => {
        this.setState({ server: snap.val() });
      });
    }
  }

  componentDidMount() {
    let serverRef = firebase
      .database()
      .ref(`servers/${this.props.match.params.id}`);

    serverRef.on("value", snap => {
      this.setState({ server: snap.val() });
    });

    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          // console.log("user", user);
          this.setState({ user });
        } else {
          // console.log("NO USER");
          this.setState({ user: { uid: "guest" } });
        }
      }.bind(this)
    );
  }

  render() {
    // console.log("this.state", this.state);
    return (
      <div className="server-page">
        <div className="body">
          <div className="left">
            <Channels
              serverId={this.props.match.params.id}
              serverName={this.state.server.name}
              changeChannel={this.changeChannel}
              currentChannelName={this.state.currentChannelName}
              user={this.state.user}
            />
          </div>
          <div className="middle">
            <Chat
              serverName={this.props.match.params.id}
              channelName={this.state.currentChannelName}
              channelSubtitle={this.state.currentChannelSubtitle}
              user={this.state.user}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Servers;
