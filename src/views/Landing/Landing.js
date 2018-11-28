
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Landing.scss";
import Login from "../Login/Login";
import firebase from "../../firebase";
import logo from "../../media/logo_transparent.png";

function Home(props) {
  return (
    <div className="home-page">
      <span className="home-page-links">
        <Link to="/server/-LRJIG0Y_f2mtEVOL5CE" className="home-page-link">View Global Server </Link>
        <Link to="/login" className="home-page-link"> Login / Signup</Link>
      </span>
      <span className="logo-container">
        <img className="logo_transparent" alt="logo&tagline" src={logo} />
      </span>
    </div>
  );
}
export default Home;
