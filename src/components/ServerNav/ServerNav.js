import React, { Component } from "react";
import firebase from "../../firebase";
import ServerModal from "../ServerModal/ServerModal";
import SingleServer from "../SingleServer/SingleServer";
import { NavLink, withRouter } from "react-router-dom";
import "./ServerNav.scss";

class ServerNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: {},
      isOpen: false,
      modalState: "default",
      channels: "",
      icon: "",
      name: "",
      user: {}
    };
  }

  componentDidMount() {
    // console.log(this.props);
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.props.history.push("/login");
      } else {
        // console.log(user);
        const ref = firebase.database().ref(`users/${user.uid}`);
        ref.on("value", (snapshot) => {
          // console.log("snapshot:", snapshot.val());
          this.setState({
            user: snapshot.val(),
            servers: snapshot.val().servers
          });
        });
      }
    });
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props !== prevProps) {
  //     this.getServers();
  //   }
  // }

  // getServers = () => {
  //   const { servers, user } = this.state;
  //   console.log(user.uid);
  //   const ref = firebase.database().ref(`users/${user.uid}/servers`);
  //   ref.on("value", snapshot => {
  //     this.setState({ servers: snapshot.val() });
  //   });
  // }

  toggleNew = () => {
    this.setState({ modalState: "new" });
  };

  toggleJoin = () => {
    this.setState({ modalState: "join" });
  };

  toggleDefault = () => {
    this.setState({ modalState: "default" });
  };

  handleOpenModal = () => {
    this.setState({ isOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isOpen: false });
  };

  handleChannelsInput = (e) => {
    this.setState({ channels: e.target.value });
  };

  handleIconInput = (e) => {
    this.setState({ icon: e.target.value });
  };

  handleNameInput = (e) => {
    this.setState({ name: e.target.value });
  };

  addServer = (e) => {
    e.preventDefault();
    const { icon, channels, name, user } = this.state;
    const serverRef = firebase.database().ref("servers");
    serverRef.push({
      channels: { general: "home" },
      icon: icon,
      members: { [user.uid]: user.username },
      name: name,
      admins: { [user.uid]: user.username }
    });
    serverRef
      .endAt()
      .limitToLast(1)
      .on("child_added", (snapshot) => {
        const usersRef = firebase
          .database()
          .ref(`users/${user.uid}/servers/${snapshot.key}`);
        usersRef.set(snapshot.val().name);
      });
    this.clearInputs();
    this.setState({ isOpen: false, modalState: "default" });
  };

  addMember = (e) => {
    e.preventDefault();
    const { name, user } = this.state;
    const serversRef = firebase.database().ref(`servers/${name}`);
    const membersRef = firebase
      .database()
      .ref(`servers/${name}/members/${user.uid}`);
    const usersRef = firebase
      .database()
      .ref(`users/${user.uid}/servers/${name}`);
    membersRef.set(user.username);
    serversRef.once("value", (snapshot) => {
      usersRef.set(snapshot.val().name);
    });
    this.clearInputs();
    this.setState({ isOpen: false, modalState: "default" });
  };

  clearInputs = () => {
    this.setState({ channels: "", icon: "", name: "" });
  };

  render() {
    const {
      servers,
      isOpen,
      channels,
      icon,
      name,
      modalState,
      user
    } = this.state;
    const { pathname } = this.props.location;
    let serverList = [];
    let view = "/direct";
    let viewText = "Direct Messages";
    let display = null;
    // console.log(this.state);
    for (let key in servers) {
      let singleServer = (
        <div className="serverList-cont" key={key}>
          <SingleServer objKey={key} />
        </div>
      );
      serverList.push(singleServer);
    }
    if (pathname === "/dashboard") {
      view = "/direct";
      viewText = "Direct Messages";
    } else {
      view = "/dashboard";
      viewText = "Dashboard";
    }
    if (!firebase.auth().currentUser) {
      display = "none";
    }
    return (
      <div className="main-nav-cont" style={{ display: display }}>
        {!user ? (
          <p>Loading...</p>
        ) : (
          <>
            <NavLink to="/profile" className="profile-link">
              <img src={user.avatar} alt={user.username} />
            </NavLink>
            <h2>{user.username}</h2>
          </>
        )}
        <NavLink
          to="/"
          className="signout-link"
          onClick={() => firebase.auth().signOut()}
        >
          Log out
        </NavLink>
        {/* <NavLink to={view} className="toggle-link">
          {viewText}
        </NavLink> */}

        <NavLink to="/dashboard" className="toggle-link">
          Dashboard
        </NavLink>
        <h3>My Servers</h3>
        {serverList}
        <button onClick={() => this.handleOpenModal()}>+</button>
        <ServerModal
          isOpen={isOpen}
          handleCloseModal={this.handleCloseModal}
          handleOpenModal={this.handleOpenModal}
          handleIconInput={this.handleIconInput}
          handleNameInput={this.handleNameInput}
          addServer={this.addServer}
          addMember={this.addMember}
          toggleNew={this.toggleNew}
          toggleJoin={this.toggleJoin}
          toggleDefault={this.toggleDefault}
          modalState={modalState}
          channels={channels}
          icon={icon}
          name={name}
        />
      </div>
    );
  }
}

export default withRouter(ServerNav);
