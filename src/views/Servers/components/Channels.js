import React, { Component } from "react";

import firebase from "../../../firebase";
import "./Channels.scss";
import AdminModal from "./AdminModal";

class Channels extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channels: {},
      isAdmin: false,
      settingsMenu: false,
      modalType: "",
      modalOpen: false
    };

    this.getChannels = this.getChannels.bind(this);
    this.getAdmins = this.getAdmins.bind(this);

    this.clickGear = this.clickGear.bind(this);
    this.closeSettingsMenu = this.closeSettingsMenu.bind(this);

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({ modalOpen: !this.state.modalOpen });
    this.getChannels();
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
    console.log("GETTING ADMINS");

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
    // console.log("this.props, prevProps", this.props, prevProps);
    if (this.props.serverId !== prevProps.serverId) {
      console.log("NEW CHANNEL PROPS");
      // console.log("this.props", this.props);
      this.getAdmins();
      this.getChannels();
    }
    // else if (this.props !== prevProps) {
    //   this.getChannels();
    // }
  }

  componentDidMount() {
    this.getAdmins();
    this.getChannels();
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
          if (key === "original") {
            this.props.changeChannel({
              name: this.state.channels[key].name,
              subtitle: this.state.channels[key].description
            });
          }
        }
      });
  }

  render() {
    // console.log("CHANNELS this.props", this.props);
    // console.log("channels this.state", this.state);

    let channelsArr = [];

    for (let key in this.state.channels) {
      // console.log("key", key);
      let activeStatus = "";
      if (this.props.currentChannelName === this.state.channels[key].name) {
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
              name: this.state.channels[key].name,
              subtitle: this.state.channels[key].description
            });
          }}
        >
          <div className="channel-name">#{this.state.channels[key].name}</div>
          {/* {conditionally render edit button here} */}
          {this.state.isAdmin ? (
            <button
              className="edit-button"
              onClick={() => {
                console.log(`${key} edit clicked`);
                this.setState(
                  {
                    modalType: { type: "edit channel", key: key }
                  },
                  () => {
                    this.toggleModal();
                  }
                );
              }}
            >
              <img
                className="edit-img"
                src="https://www.materialui.co/materialIcons/image/edit_white_192x192.png"
                alt="edit icon"
              />
            </button>
          ) : null}
        </div>
      );

      channelsArr.push(newDiv);
    }
    return (
      <div className="channels">
        {this.state.modalOpen ? (
          <AdminModal
            modalOpen={this.state.modalOpen}
            toggleModal={this.toggleModal}
            modalType={this.state.modalType}
            serverId={this.props.serverId}
          />
        ) : null}

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
                  <button
                    className="menu-button"
                    onClick={() => {
                      this.setState(
                        {
                          modalType: { type: "edit server" }
                        },
                        () => {
                          this.toggleModal();
                        }
                      );
                    }}
                  >
                    Edit Server
                  </button>
                  {/* <button
                    className="menu-button"
                    onClick={() => {
                      this.setState(
                        {
                          modalType: { type: "add admin" }
                        },
                        () => {
                          this.toggleModal();
                        }
                      );
                    }}
                  >
                    Add Admin
                  </button> */}
                  <button
                    className="menu-button"
                    onClick={() => {
                      this.setState(
                        {
                          modalType: { type: "add channel" }
                        },
                        () => {
                          this.toggleModal();
                        }
                      );
                    }}
                  >
                    Add Channel
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="title">Channels</div>
        {channelsArr}
        {/* <div className="invite-container"> */}

        {/* <button className="invite-button">Invite</button> */}
        {/* </div> */}
      </div>
    );
  }
}

export default Channels;
