import React, { Component } from "react";
import firebase from "../../firebase";
// import "./Dashboard.scss";

class Server extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server: {
        name: "",
        members: [],
        icon: "",
        channels: []
      }
    }
  }
  componentDidMount() {
    const { server } = this.props;
    console.log(server);
    for(let key in server) {
      this.setState({name: key, members: server.members})
    }
  }
  render() {
    return (
      <div>
        Server
      </div>
    );
  }
}

export default Server;