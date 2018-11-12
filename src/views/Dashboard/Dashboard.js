import React, { Component } from "react";
import firebase from "../../firebase";
import ServerNav from "../../components/ServerNav/ServerNav";
import "./Dashboard.scss";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: []
    }
  }
  componentDidMount() {
    const ref =  firebase.database().ref("servers");
    const { servers } = this.state;
    let list = servers.slice();
    ref.on("value", snapshot => {
      snapshot.forEach(childSnapshot => {
        let key = childSnapshot.key;
        let value = childSnapshot.val();
        list.push({[key]: value});
        console.log(list);
      });
      this.setState({servers: list})
    });
  }

  addServer() {

  }
  render() {
    const { servers } = this.state;
    console.log(servers);
    let serverList = servers.map((server, i) => (
        <div className="serverList-cont" key={i}>
          <ServerNav server={server} />
        </div>
    ));
    return (
      <div className="main-dash-cont">
        <h1>Dashboard</h1>
        {serverList}
        <button onClick={() => this.addServer()}>+</button>
      </div>
    );
  }
}

export default Dashboard;
