import React, { Component } from "react";
import firebase from "../../firebase";
import DirectMessageSidebar from "../../components/DirectMessageSidebar/DirectMessageSidebar";
import moment from "moment";
import "./Dashboard.scss";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {}
    }
  }
  componentDidMount() {
    const ref = firebase.database().ref("users");
    ref.on("value", snapshot => {
      // console.log("snapshot:", snapshot.val());
      this.setState({ users: snapshot.val() });
    });  
  }

  render() {
    const { users } = this.state;
    console.log(this.state);
    let onlineList = [];
    let offlineList = [];
    let colorStatus = "";
    for (let key in users) {
      let loggedOff = moment
        .unix(users[key].ended / 1000)
        .fromNow();
      console.log(moment.unix(users[key].ended / 1000).fromNow());
      if (users[key].status === "online") {
        colorStatus = "#5a7164";
      } else if (users[key].status === "idle") {
        colorStatus = "orange";
      } else if (users[key].status === "offline") {
        colorStatus = "#e0e0e0";
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
    return (
      <div className="main-dash-cont">
        <DirectMessageSidebar />
        <h1>Dashboard</h1>
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
