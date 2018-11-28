import React, { Component } from "react";

import firebase from "../../../firebase";
import "./Channels.scss";

class Channels extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channels: {},
      isAdmin: false,
      settingsMenu: false
    };

    this.getChannels = this.getChannels.bind(this);
    this.getAdmins = this.getAdmins.bind(this);

    this.clickGear = this.clickGear.bind(this);
    this.closeSettingsMenu = this.closeSettingsMenu.bind(this);
  }

  clickGear(e) {
    e.preventDefault();

    this.setState({ settingsMenu: true }, () => {
      document.addEventListener("click", this.closeSettingsMenu);
    });
  }

  closeSettingsMenu() {
    this.setState({ settingsMenu: false }, () => {
      document.removeEventListener("click", this.closeSettingsMenu);
    });
  }

  getAdmins() {
    let adminRef = firebase
      .database()
      .ref(`servers/${this.props.serverId}/admins`);

    adminRef.once("value", (snap) => {
      this.setState({ admins: snap.val() }, () => {
        // console.log("this.state.admins", this.state.admins);

        if (this.props.user.uid) {
          adminRef.child(this.props.user.uid).once("value", (snap) => {
            if (snap.exists()) {
              // console.log("current user is admin");
              this.setState({ isAdmin: true });
            } else {
              this.setState({ isAdmin: false });
            }
          });
        }
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.serverId !== prevProps.serverId) {
      // console.log("NEW CHANNEL PROPS");
      // console.log("this.props", this.props);

      this.getChannels();
      this.getAdmins();
    }
  }

  componentDidMount() {
    this.getChannels();
    this.getAdmins();
  }

  getChannels() {
    // console.log("GETTING CHANNELS");

    let serverRef = firebase.database().ref(`servers/${this.props.serverId}`);

    serverRef
      .child("channels")
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
      let activeStatus = "";
      if (this.props.currentChannel === key) {
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
        <div className="header">
          {this.props.serverName}
          {this.state.isAdmin ? (
            <div
              onClick={(e) => {
                this.clickGear(e);
              }}
              className="gear-div"
            >
              <img
                className="gear-img"
                src="http://purepng.com/public/uploads/large/purepng.com-settings-icon-android-kitkatsymbolsiconsapp-iconsandroid-kitkatandroid-44-721522597677p9lc8.png"
                alt="gear icon"
              />
              {this.state.settingsMenu ? (
                <div className="settings-menu">
                  <button className="menu-button">Edit Server</button>
                  <button className="menu-button">Add Admin</button>
                  <button className="menu-button">Add Channel</button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        {channelsArr}
        {/* <div className="invite-container"> */}
        <button className="invite-button">Invite</button>
        {/* </div> */}
      </div>
    );
  }
}

export default Channels;
