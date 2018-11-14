import React, { Component } from "react";
import firebase from "../../firebase";
import ServerNav from "../../components/ServerNav/ServerNav";
import "./Dashboard.scss";

class Dashboard extends Component {
  componentDidMount() {
    // this.getServers();
  }

  render() {
    return (
      <div className="main-dash-cont">
        <h1>Dashboard</h1>
        <ServerNav />
      </div>
    );
  }
}

export default Dashboard;
