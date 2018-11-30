import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Landing.scss";
import firebase from "../../firebase";
import logo from "../../media/logo_transparent.png";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: null
    };
  }

  componentDidMount() {
    // if !logged in, return login link, else logout link
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.setState({ loggedIn: false });
      } else {
        this.props.history.push('/dashboard');
        this.setState({ loggedIn: true });
      }
    });
  }

  render() {
    return (
      <div className="homepage">
        <div className="homepage-links">
        {!this.state.loggedIn ?(
          <Link to="/server/-LSRXkbdM4Ny08d-3m0k" className="homepage-link">
              View Global Server{" "}
          </Link>
        ) : (
          <Link to="/dashboard" className="homepage-link">
            Dashboard
          </Link>
        )
        }
        {!this.state.loggedIn ? (
          <Link to="/login" className="homepage-link">
            {" "}
            Login / Signup
          </Link>
        ) : (
          <button
            className="homepage-link homepage-signout-button"
            onClick={() => firebase.auth().signOut()}
          >
            Log out
          </button>
        )}
        </div>
        <div className="logo-container">
          <img className="logo_transparent" alt="logo&tagline" src={logo} />
        </div>

        <div className="homepage-footer">
          <div className="homepage-footer-group">
            {" "}
            <h4>Direct Messaging</h4>{" "}
            <p>for communicating with individuals.</p>
          </div>

          <div className="homepage-footer-group">
            {" "}
            <h4>Servers</h4>{" "}
            <p>for group discussions & collaboration. </p>
          </div>

          <div className="homepage-footer-group">
            {" "}
            <h4>Code Snippets</h4>{" "}
            <p>for sharing code (with preserved code indentation). </p>
          </div>

          <div className="homepage-footer-group">
            {" "}
            <h4>Inspired</h4>{" "}
            <p>
              by Slack & Discord.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
