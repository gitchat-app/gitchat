import React, { Component } from "react";
import firebase from "../../firebase";
import DirectMessageSidebar from "../../components/DirectMessageSidebar/DirectMessageSidebar";
import moment from "moment";
import GuestModal from "../../components/GuestModal/GuestModal";
import SingleServer from "../../components/SingleServer/SingleServer";
import "./Dashboard.scss";
import Axios from "axios";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      servers: {},
      friends: {},
      guestModal: false
    };

    this.findServers = this.findServers.bind(this);
  }
  componentDidMount() {
    // const { guestModal} = this.state;
    const friendsRef = firebase.database().ref("users");
    const serverRef = firebase.database().ref("servers");
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        // this.props.history.push("/login");
        this.setState({guestModal: true});
        // return <GuestModal status={guestModal} />
      } else {
        // console.log(user);
        const ref = firebase.database().ref(`users/${user.uid}`);
        ref.on("value", (snapshot) => {
          // console.log("snapshot:", snapshot.val());
          this.setState({
            user: snapshot.val(),
          }, () =>
              this.findServers());
        });
      }
    });
    friendsRef.on("value", (snapshot) => {
      // console.log("snapshot:", snapshot.val());
      this.setState({ friends: snapshot.val() });
    });
    serverRef.on("value", (snapshot) => {
      // console.log("snapshot:", snapshot.val());
      this.setState({ servers: snapshot.val() });
    });
  }

  findServers() {
    //NOTE: if you just call findServers() in the render, it will give an infinite loop error. if it's in the componentDidMount, it will get called before this.state.user.uid exists. (you can probably do it in the mount if you do an async await for the user info to come back)
    const singleServerList = [];
    //this console.log is to show each time the loop is run
    // console.log("FINDING SERVERS");
    const { servers, user } = this.state;
    for (let key in servers) {
      let singleServer = (
        <div 
          className="dash-server-card" key={key}>
          <SingleServer objKey={key} />
        </div>
      );

      if (user.uid) {
        const serverRef = firebase
          .database()
          .ref(`servers/${key}/members/${user.uid}`);
        serverRef.once("value", (snap) => {
          //if the snap exists, then the user is in that server, so we want to push the ones the user ISN'T in via the else
          if (snap.exists()) {
            // console.log("EXISTS", key, snap.val());
          } else {
            // console.log("DOESN'T EXIST", key);
            singleServerList.push(singleServer);
          }
        });
      } else {
        // console.log("No user.uid");
      }
    }
    // console.log("singleServerList", singleServerList);
    //singleServerList is now a list of servers the user isn't in
    this.setState({ singleServerList });
  }

  componentWillUnmount() {
    console.log("Dash unmounting");
  }

  render() {
    const { friends, singleServerList, guestModal } = this.state;
    // console.log(this.state);
    let onlineList = [];
    let offlineList = [];
    let colorStatus = "";
    for (let key in friends) {
      let loggedOff = moment.unix(friends[key].ended / 1000).fromNow();
      if (friends[key].status === "online") {
        colorStatus = "#e0e0e0";
      } else if (friends[key].status === "idle") {
        colorStatus = "orange";
      } else if (friends[key].status === "offline") {
        colorStatus = "#5a7164";
      }
      let singleUser = (
        <div className="userList-cont" key={key}>
          <div
            style={{ background: colorStatus }}
            className="online-status-color"
          />
          <p>{friends[key].username}</p>
          <img src={friends[key].avatar} alt="" />
        </div>
      );
      if (friends[key].status === "online") {
        onlineList.push(singleUser);
      } else if (friends[key].status === "offline") {
        offlineList.push(
          <>
            {singleUser}
            <h5>Logged off {loggedOff}...</h5>
          </>
        );
      }
    }
    return <div className="main-dash-cont">
        <GuestModal status={guestModal} />
        <DirectMessageSidebar />
        <div className="dash-list-cont">
          <h1>Dashboard</h1>
          <div className="scrollbar" id="style-8">
            {singleServerList}
          </div>
        </div>
        <div className="friends-cont">
          <h3>Friends</h3>
          <h4>Online</h4>
          {onlineList}
          <h4>Offline</h4>
          {offlineList}
        </div>
      </div>;
  }
}

export default Dashboard;
