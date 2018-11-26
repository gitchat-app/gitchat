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
    const { users } = this.state;
    const usersRef = firebase.database().ref("users");
    usersRef.on("value", snapshot => {
      // console.log("snapshot:", snapshot.val());
      this.setState({ users: snapshot.val() });
    });
    const serverRef = firebase.database().ref("servers");
    serverRef.on("value", snapshot => {
      // console.log("snapshot:", snapshot.child());
      // snapshot.forEach(childSnap => {
      //   let key = childSnap.key;
      //   console.log(childSnap.child(`members`).val())
      // })
      this.setState({ servers: snapshot.val() });
    });  
  }

  render() {
    const { users, servers } = this.state;
    console.log(this.props);
    let onlineList = [];
    let offlineList = [];
    let dashList = [];
    let colorStatus = "";
    for (let key in users) {
      let loggedOff = moment
        .unix(users[key].ended / 1000)
        .fromNow();
      // console.log(moment.unix(users[key].ended / 1000).fromNow());
      if (users[key].status === "online") {
        colorStatus = "#e0e0e0";
      } else if (users[key].status === "idle") {
        colorStatus = "orange";
      } else if (users[key].status === "offline") {
        colorStatus = "#5a7164";
      }
      // console.log(users[key].status);
      let singleUser = <div className="userList-cont" key={key}>
        <div style={{"background": colorStatus}} className="online-status-color"></div>
        <p>{users[key].username}</p>
        <img src={users[key].avatar} alt="" />
        </div>;
      if (users[key].status === "online") {
        onlineList.push(singleUser);
      } else if (users[key].status === "offline") {
        setTimeout(offlineList.push(<>{singleUser}<h5>Logged off {loggedOff}...</h5></>), 10000);
      }
    }
    for (let key in servers) {
      let singleServer = (
        <div className="dash-server-card" key={key}>
          <SingleServer objKey={key} />
        </div>
      );
      console.log(Object.keys(servers[key].members));
      let keys = Object.keys(servers[key].members);
      // keys.map(key => key === users.uid ? null : dashList.push(singleServer))
      dashList.push(singleServer);
    }
    return (
      <div className="main-dash-cont">
        <DirectMessageSidebar />
        <div className="dash-list-cont">
          <h1>Dashboard</h1>
          <div className="scrollbar" id="style-7">
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
