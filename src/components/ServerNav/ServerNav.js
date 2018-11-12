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
    const { server } = this.props;
    console.log(server);
    for(let key in server) {
      const ref = firebase.database().ref(key);
      ref.on("value", snapshot => {
        let count = snapshot.child("members").numChildren();
        
        this.setState({members: count})
      });
      this.setState({name: server[key].name, icon: server[key].icon, channels: server[key].channels})
    }
  }
  render() {
    console.log(this.state);
    const { name, members, icon, channels } = this.state;
    return (
      <div className="serverNav-main-cont">
        <img src="https://i2.wp.com/www.ahfirstaid.org/wp-content/uploads/2014/07/avatar-placeholder.png" alt={name} />
        <p>{name}</p>
      </div>
    );
  }
}

export default ServerNav;