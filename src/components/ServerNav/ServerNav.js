import React, { Component } from "react";
import firebase from "../../firebase";
import ServerModal from "../ServerModal/ServerModal";
import SingleServer from "../SingleServer/SingleServer";
import { Link } from "react-router-dom";
import "./ServerNav.scss";

class ServerNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: {},
      isOpen: false,
      modalState: 'default',
      channels: '',
      icon: '',
      name: '',
      user: {}
    }
  }

  componentDidMount() {
    this.getServers();
    console.log(this.props);
    firebase
      .auth()
      .onAuthStateChanged(user => {
        if (!user) {
          window.location.assign("http://localhost:3000/login");
        } else {
          console.log(user);
          const ref = firebase.database().ref(`users/${user.uid}`);
          ref.once("value", snapshot => {
            console.log("snapshot:", snapshot.val());
            this.setState({ user: snapshot.val() });
          });
        }
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.getServers();
    }
  }

  getServers = () => {
    const { servers, user } = this.state;
    const ref = firebase.database().ref("servers");
    ref.off();
    ref.on("value", snapshot => {
      snapshot.forEach(childSnap => {
        // console.log('childSnap: ', childSnap.key);
        // console.log("childSnap: ", childSnap.child("/members").val());
        childSnap.child("/members").forEach(grandChildSnap => {
          console.log(grandChildSnap.key)
          if (grandChildSnap.key === user.uid) {
            servers.push(snapshot.val());
          }
        })

      })
      // this.setState({ servers: snapshot.val() });
    });
  }

  toggleNew = () => {
    this.setState({ modalState: "new" })
  }

  toggleJoin = () => {
    this.setState({ modalState: "join" })
  }

  toggleDefault = () => {
    this.setState({ modalState: "default" })
  }

  handleOpenModal = () => {
    this.setState({ isOpen: true });
  }

  handleCloseModal = () => {
    this.setState({ isOpen: false });
  }

  handleChannelsInput = e => {
    this.setState({ channels: e.target.value });
  }

  handleIconInput = e => {
    this.setState({ icon: e.target.value });
  }

  handleNameInput = e => {
    this.setState({ name: e.target.value });
  }

  addServer = e => {
    e.preventDefault();
    const serverRef = firebase.database().ref("servers");
    const { icon, channels, name, user } = this.state;
    serverRef.push({
      channels: { general: "home" },
      icon: icon,
      members: { [user.uid]: user.username },
      name: name,
      admins: { [user.uid]: user.username }
    });
    this.clearInputs();
    this.setState({isOpen: false})
  }

  addMember = e => {
    e.preventDefault();
    const { name } = this.state;
    const membersRef = firebase.database().ref(`servers/${name}/members`);
    membersRef.push({
      // this.props.user.id;
    });
    this.clearInputs();
  }

  clearInputs = () => {
    this.setState({ channels: "", icon: '', name: '', })
  }

  render() {
    const { servers, isOpen, channels, icon, name, modalState, user } = this.state;
    let serverList = [];
    for (let key in servers) {
      let singleServer = <div className="serverList-cont" key={key}><SingleServer objKey={key} /></div>;
      serverList.push(singleServer);
    }
    return (
      <div className="main-nav-cont">
        <img src={user.avatar} alt={user.username} />
        <p>{user.username}</p>
        <Link to='/' onClick={() => firebase.auth().signOut()}>Signout</Link>
        {serverList}
        <button
          onClick={() => this.handleOpenModal()}>+</button>
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

export default ServerNav;