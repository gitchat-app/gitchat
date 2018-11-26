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
    // console.log("CHANNELS this.props", this.props);

    let channelsArr = [];

    for (let key in this.state.channels) {
      let newDiv = (
        <button
          key={key}
          className="channel-button"
          onClick={() => {
            this.className = "channel-button-active";
            this.props.changeChannel({
              name: key,
              subtitle: this.state.channels[key]
            });
          }}
        >
          <h2>#{key}</h2>
        </button>
      );

      // let newDiv = (
      //   <ActiveButton
      //     buttonType="channel"
      //     onClick={() => {
      //       this.props.changeChannel({
      //         name: key,
      //         subtitle: this.state.channels[key]
      //       });
      //     }}
      //     channelName={key}
      //   />
      // );

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
