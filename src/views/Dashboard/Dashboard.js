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
      user: {},
      userServers: [],
      servers: {},
      friends: {}
    }
  }
  componentDidMount() {
    const { user, servers, userServers } = this.state;
    const friendsRef = firebase.database().ref("users");
    const serverRef = firebase.database().ref("servers");
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
            userServers: Object.keys(snapshot.val().servers)
          });
        });
      }
    });
    friendsRef.on("value", snapshot => {
      // console.log("snapshot:", snapshot.val());
      this.setState({ friends: snapshot.val() });
    });
    serverRef.on("value", snapshot => {
      console.log("snapshot:", snapshot.val());
      // let allServers = [];
      // let serverCopy = servers.slice();
      // snapshot.forEach(childSnap => {
        // allServers.push(childSnap.key);
        // let key = childSnap.key;
        // childSnap.
        // childSnap.child("members").forEach(member => {
        //   console.log(member.key, user.uid);
        //   if(member.key !== user) {
        //     serverCopy.push(key);
        //   }
        // });
        // allServers.filter(userKey => {
        //   // userKey !== key ? serverCopy.push(key) : null
        //   console.log(userKey, key);
        //   return serverCopy;
        // });
        // console.log(childSnap.child(`members`).val());
        // if(childSnap.val())
      // });
      // console.log(allServers);
      // allServers.map(server => {
      //   return userServers.map(key => console.log('key : ', key ))
      //   })
      //   !== server ? serverCopy.push(server) : null));
      this.setState({ servers: snapshot.val() });
    });  
  }

  render() {
    const { userServers, servers, friends, user } = this.state;
    console.log(this.state);
    let onlineList = [];
    let offlineList = [];
    let dashList = [];
    let colorStatus = "";
    for (let key in friends) {
      let loggedOff = moment
        .unix(friends[key].ended / 1000)
        .fromNow();
      // console.log(moment.unix(users[key].ended / 1000).fromNow());
      if (friends[key].status === "online") {
        colorStatus = "#e0e0e0";
      } else if (friends[key].status === "idle") {
        colorStatus = "orange";
      } else if (friends[key].status === "offline") {
        colorStatus = "#5a7164";
      }
      // console.log(users[key].status);
      let singleUser = <div className="userList-cont" key={key}>
        <div style={{"background": colorStatus}} className="online-status-color"></div>
        <p>{friends[key].username}</p>
        <img src={friends[key].avatar} alt="" />
        </div>;
      if (friends[key].status === "online") {
        onlineList.push(singleUser);
      } else if (friends[key].status === "offline") {
        offlineList.push(<>{singleUser}<h5>Logged off {loggedOff}...</h5></>);
      }
    }
    for (let key in servers) {
      let singleServer = (
        <div className="dash-server-card" key={key}>
          <SingleServer objKey={key} />
        </div>
      );
      // console.log(Object.keys(servers[key].members));
      // console.log('servers[key].members: ', servers[key].members);
      let keys = Object.keys(servers[key].members);
      dashList.push(singleServer);
      for(let member in servers[key].members) {
        console.log(member);
        
        if(member === user.uid) {
          dashList.splice()
        }
      }
      // userServers.map(userKey => {
      //   if(userKey !== key) {
      //     dashList.push(singleServer);
      //   }
      //   return dashList;
      // });
    }
    // let dashList = servers.map((server, i) => {
    //   console.log(server);
    //   return <div className="dash-server-card" key={i}>
    //       <SingleServer objKey={server} />
    //     </div>
    // })

    return (
      <div className="main-dash-cont">
        <DirectMessageSidebar />
        <div className="dash-list-cont">
          <h1>Dashboard</h1>
          <div className="scrollbar" id="style-8">
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
