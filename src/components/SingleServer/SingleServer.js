import React, { Component } from "react";
import firebase from "../../firebase";
import { NavLink } from "react-router-dom";
import Popup from "reactjs-popup";
import "./SingleServer.scss";

class SingleServer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      members: 0,
      online: 0,
      icon: "",
      description: "",
      channels: {},
      serverInfo: false
    }
  }

  componentDidMount() {
    const { channels } = this.state;
    const { objKey } = this.props;
    let userKeys = [];
    let onlineUsers = 0;
    const ref = firebase.database().ref(`servers/${objKey}`);
    const usersRef = firebase.database().ref(`servers/${objKey}/members`); 
   
    ref.on("value", snapshot => {
      let nameVal = snapshot.child("name").val();
      let count = snapshot.child("members").numChildren();
      let iconVal = snapshot.child("icon").val();
      let channelsVal = snapshot.child("channels").val();
      let descVal = snapshot.child("description").val();
      this.setState({ name: nameVal, members: count, icon: iconVal, description: descVal, channels: channelsVal })
    });
    usersRef.on("value", snap => {
      snap.forEach(user => {
        userKeys.push(user.key);
      })
    });
    userKeys.map(user => {
      const onlineRef = firebase.database().ref(`users/${user}/status`);
      onlineRef.once("value", snap => {
        console.log(snap.val());
        if (snap.val() === "online") {
          onlineUsers += 1;
        } 
      })
      return this.setState({online: onlineUsers})
    })
  }

  handleCloseModal = () => {
    this.setState({ serverInfo: false });
  };

  render() {
    // console.log(this.state);
    const { name, icon, online, members, description } = this.state;
    const { objKey } = this.props;
    return (
      <div className="single-server-main-cont">
        <NavLink
          className="server-link" 
          to={`/server/${objKey}`}>
          <img  
            className="form-img"
            src={icon}
            alt=""
          />
        </NavLink>
        {/* <p >{name}</p> */}
        <Popup
          position="bottom center"
          trigger={<p>{name}</p>}
          on="hover"
          className="Popup"
          contentStyle={{ background: "#2d3832", border: "none"}}
          arrowStyle={{ background: "#2d3832"}}
        >
          <div className="info">
            <p>Total members: {members}</p>
            <p>Online members: {online}/{members}</p>
            <p>Server Desc: {description}</p>
          </div>
        </Popup>
      </div>
    );
  }
}

export default SingleServer;