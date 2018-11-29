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
      description: "",
      user: {}
    }

    this.uploadImage = this.uploadImage.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentDidMount() {
    // console.log(this.props);
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        // this.props.history.push("/login");
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

  handleDescInput = (e) => {
    this.setState({ description: e.target.value });
  };

  addServer = (e) => {
    e.preventDefault();
    const { icon, description, name, user } = this.state;
    const serverRef = firebase.database().ref("servers");
    serverRef.push({
      channels: { original: { description: "home", name: "general" } },
      icon: icon,
      members: { [user.uid]: user.username },
      name: name,
      admins: { [user.uid]: user.username },
      description: description
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

  async handleLogOut() {
    await firebase.auth().signOut();
    await this.props.history.push("/");
  }

  
  async uploadImage() {
    let uploader = document.getElementById('uploader').files[0];
    let fileRef = firebase.storage().ref(`server_images/${uploader.name}`);
    await fileRef.put(uploader);
    await fileRef.getDownloadURL().then(url => {
      console.log(url);
      this.setState({icon: url});
    });
  }

  componentWillUnmount() {
    console.log("ServerNav Unmounting");
  }

  render() {
    const { servers, isOpen, channels, icon, name, modalState, user, description } = this.state;
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
              <img src={user.avatar} alt={user.username} className="profile-img" />
            </NavLink>

            <h2>{user.username}</h2>
          </>
        )}
        <button
          onClick={() => this.handleLogOut()}
          className="signout-link"
        >
          Log out
        </button>
        <NavLink to="/dashboard" className="toggle-link">
          Dashboard
        </NavLink>
        <h3>My Servers</h3>
        <div className="scrollbar" id="style-9">
        {serverList}
        </div>
        <button onClick={() => this.handleOpenModal()}>+</button>
        <ServerModal
          isOpen={isOpen}
          handleCloseModal={this.handleCloseModal}
          handleOpenModal={this.handleOpenModal}
          handleIconInput={this.handleIconInput}
          handleNameInput={this.handleNameInput}
          handleDescInput={this.handleDescInput}
          addServer={this.addServer}
          addMember={this.addMember}
          toggleNew={this.toggleNew}
          toggleJoin={this.toggleJoin}
          toggleDefault={this.toggleDefault}
          uploadImage={this.uploadImage}
          modalState={modalState}
          channels={channels}
          icon={icon}
          name={name}
          description={description}
        />
      </div>
    );
  }
}

export default withRouter(ServerNav);
