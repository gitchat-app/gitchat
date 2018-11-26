import React, { Component } from "react";

import firebase from "../../../firebase";
import "./Channels.scss";

class Channels extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channels: {}
    };

    this.getChannels = this.getChannels.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.serverId !== prevProps.serverId) {
      // console.log("NEW CHANNEL PROPS");
      // console.log("this.props", this.props);

      this.getChannels();
    }
  }

  componentDidMount() {
    this.getChannels();
  }

  getChannels() {
    // console.log("GETTING CHANNELS");

    let channelsRef = firebase
      .database()
      .ref(`servers/${this.props.serverId}/channels`);

    channelsRef
      .once("value")
      .then((snap) => {
        // console.log("snap.val()", snap.val());

        this.setState({ channels: snap.val() });
      })
      .then(() => {
        for (let key in this.state.channels) {
          if (key === "general") {
            this.props.changeChannel({
              name: key,
              subtitle: this.state.channels[key]
            });
          }
        }
      });
  }

  render() {
    console.log("CHANNELS this.props", this.props);

    let channelsArr = [];

    for (let key in this.state.channels) {
      let activeStatus = "";
      if (this.props.currentChannel === key) {
        console.log(
          "this.props.currentChannel, key",
          this.props.currentChannel,
          key
        );
        activeStatus = "active";
      } else {
        activeStatus = "inactive";
      }

      let newDiv = (
        <div
          key={key}
          className={`channel-button-${activeStatus}`}
          onClick={() => {
            this.props.changeChannel({
              name: key,
              subtitle: this.state.channels[key]
            });
          }}
        >
          <h2>#{key}</h2>
        </div>
      );

      channelsArr.push(newDiv);
    }
    return (
      <div className="channels">
        <h1 className="header">{this.props.serverName} </h1>
        {channelsArr}
      </div>
    );
  }
}

export default Channels;
