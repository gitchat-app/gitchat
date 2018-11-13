import React, { Component } from "react";
import firebase from "../../firebase";
import ServerNav from "../../components/ServerNav/ServerNav";
import ServerModal from "../../components/ServerModal/ServerModal";
import "./Dashboard.scss";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: {},
      isOpen: false,
      modalState: 'default',
      channels: '',
      icon: '',
      name: '',
    }
  }
  
  componentDidMount() {
    this.getServers();
  }

  componentDidUpdate(prevProps) {
    if(this.props !== prevProps) {
      this.getServers();
    }
  }

  getServers = () => {
    const ref = firebase.database().ref("servers");
    const { servers } = this.state;
    let list = [];
    ref.off();
    ref.on("value", snapshot => {
      this.setState({servers: snapshot.val()});
    });
  }

  toggleNew = () => {
    this.setState({modalState: "new"})
  }

  toggleJoin = () => {
    this.setState({ modalState: "join" })
  }

  toggleDefault = () => {
    this.setState({ modalState: "default" })
  }

  handleOpenModal = () => {
    this.setState({isOpen: true});
  }

  handleCloseModal = () => {
    this.setState({ isOpen: false });
  }

  handleChannelsInput = e => {
    this.setState({ channels: e.target.value });
  }

  handleIconInput = e => {
    this.setState({icon: e.target.value});
  }

  handleNameInput = e => {
    this.setState({ name: e.target.value });
  }

  addServer = e => {
    e.preventDefault();
    const serverRef = firebase.database().ref("servers");
    const { icon, channels, name } = this.state;
    serverRef.push({
      channels: {general: "home"},
      icon: icon,
      members: {Bob: "theBobinator"},
      name: name,
      admins: {Bob: "theBobinator"}
    });
    this.clearInputs();
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
    this.setState({channels: "", icon: '', name: '',})
  }

  render() {
    const { servers, isOpen, channels, icon, name, modalState } = this.state;
    // console.log("this.state:", this.state);
    // let serverList = servers.map((server, i) => (
    //   <div className="serverList-cont" key={i}>
    //     <ServerNav server={server} />
    //   </div>
    // ));
    let serverList = [];
    for(let key in servers) {
      let singleServer = <div className="serverList-cont" key={key}><ServerNav objKey={key} /></div>;
      serverList.push(singleServer);
    }
    return (
      <div className="main-dash-cont">
        <h1>Dashboard</h1>
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

export default Dashboard;
