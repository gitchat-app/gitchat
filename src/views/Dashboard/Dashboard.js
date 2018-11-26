import React, { Component } from "react";
import firebase from "../../firebase";
import DirectMessageSidebar from "../../components/DirectMessageSidebar/DirectMessageSidebar";
import moment from "moment";
import "./Dashboard.scss";
import SingleServer from "../../components/SingleServer/SingleServer";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {},
      servers: {}
    }
  }
  componentDidMount() {
    const usersRef = firebase.database().ref("users");
    usersRef.on("value", snapshot => {
      // console.log("snapshot:", snapshot.val());
      this.setState({ users: snapshot.val() });
    });
    const serverRef = firebase.database().ref("servers");
    serverRef.on("value", snapshot => {
      // console.log("snapshot:", snapshot.val());
      this.setState({ servers: snapshot.val() });
    });  
  }

  render() {
    const { users, servers } = this.state;
    console.log(this.state);
    let onlineList = [];
    let offlineList = [];
    let dashList = [];
    let colorStatus = "";
    for (let key in users) {
      let loggedOff = moment
        .unix(users[key].ended / 1000)
        .fromNow();
      console.log(moment.unix(users[key].ended / 1000).fromNow());
      if (users[key].status === "online") {
        colorStatus = "#e0e0e0";
      } else if (users[key].status === "idle") {
        colorStatus = "orange";
      } else if (users[key].status === "offline") {
        colorStatus = "#5a7164";
      }
      console.log(users[key].status);
      let singleUser = <div className="userList-cont" key={key}>
        <div style={{"background": colorStatus}} className="online-status-color"></div>
        <p>{users[key].username}</p>
        <img src={users[key].avatar} alt="" />
        </div>;
      if (users[key].status === "online") {
        onlineList.push(singleUser);
      } else if (users[key].status === "offline") {
        offlineList.push(<>{singleUser}<h5>Logged off {loggedOff}...</h5></>);
      }
    }
    for (let key in servers) {
      let singleServer = (
        <div className="dashList-cont" key={key}>
          <SingleServer objKey={key} />
        </div>
      );
      dashList.push(singleServer);
    }
    return (
      <div className="main-dash-cont">
        <DirectMessageSidebar />
        <div className="dash-list-cont">
          <h1>Dashboard</h1>
          <div className="server-dash-cont">
            {dashList}
          </div>
        </div>
        <div className="friends-cont">
          <h3>Friends</h3>
          <h4>Online</h4>
          {onlineList}
          <h4>Offline</h4>
          {offlineList}
        </div>
      </div>
    );
  }
}

export default Dashboard;
