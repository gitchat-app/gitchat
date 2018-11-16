import React, { Component } from "react";
import firebase from "../../firebase";
import { NavLink } from "react-router-dom";
import "./SingleServer.scss";

class SingleServer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      members: 0,
      icon: "",
      channels: {}
    }
  }

  componentDidMount() {
    const { channels } = this.state;
    const { objKey } = this.props;
    const ref = firebase.database().ref(`servers/${objKey}`);
    ref.on("value", snapshot => {
      let nameVal = snapshot.child("name").val();
      let count = snapshot.child("members").numChildren();
      let iconVal = snapshot.child("icon").val();
      let channelsVal = snapshot.child("channels").val();
      this.setState({ name: nameVal, members: count, icon: iconVal, channels: channelsVal })
    });
  }

  // getInitials = () => {
  //   const { icon, name } = this.state;
  //   // let initials = "";
  //   // if(!icon) {
  //   console.log(name)
  //   // }
  //   console.log(initials);
  //   return initials;
  // }
  
  render() {
    // console.log(this.state);
    const { name, members, icon, channels } = this.state;
    // let initials = name.toUpperCase().split(' ').slice(0, 2).map(val => val.split('')[0]).join('');
    const { objKey } = this.props;
    return (
      <div className="single-server-main-cont">
        <NavLink className="server-link" to={`/server/${objKey}`}>
          <img
            className="form-img"
            src={icon}
            alt=""
            // onError={(e) => {e.target.src = initials}}
          />
        </NavLink>
        <p>{name}</p>
      </div>
    );
  }
}

export default SingleServer;