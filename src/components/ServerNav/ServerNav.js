import React, { Component } from "react";
import firebase from "../../firebase";
import "./ServerNav.scss";

class ServerNav extends Component {
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
      this.setState({name: nameVal, members: count, icon: iconVal, channels: channelsVal})
    });
  }

  getInitials = () => {
    const { icon, name } = this.state;
    let initials = "";
    // if(!icon) {
      console.log("test")
      initials = name.split(' ').slice(0, 2).map(val => val.split('')[0]).join('');
    // }
    return (<div className="default-icon">{initials}</div>);
  }

  render() {
    console.log(this.state);
    const { name, members, icon, channels } = this.state;
    return (
      <div className="serverNav-main-cont">
        {!icon 
          ? this.getInitials()
          : <img src={icon} alt={name} />
        }
        <p>{name}</p>
      </div>
    );
  }
}

export default ServerNav;