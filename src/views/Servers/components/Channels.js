import React, { Component } from "react";
// import "./Channels.scss";

import firebase from "../../../firebase";
import "./Channels.scss";
import ActiveButton from "./ActiveButton";

class Channels extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channels: {}
    };
  }

  componentDidMount() {
    let channelsRef = firebase
      .database()
      .ref(`servers/${this.props.serverName}/channels`);

    channelsRef
      .once("value")
      .then((snap) => {
        console.log("snap.val()", snap.val());

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
    let channelsArr = [];

    for (let key in this.state.channels) {
      let newDiv = (
        <button
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
