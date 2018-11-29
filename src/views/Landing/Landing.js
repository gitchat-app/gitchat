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
        this.setState({ loggedIn: true });
      }
    });
  }

  render() {
    return (
      <div className="homepage">
        <div className="homepage-links">
          <Link to="/server/-LRJIG0Y_f2mtEVOL5CE" className="homepage-link">
            View Global Server{" "}
          </Link>
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
            <p>Use direct messaging to communicate with individuals.</p>
          </div>

          <div className="homepage-footer-group">
            {" "}
            <h4>Servers</h4>{" "}
            <p>Create or join server channels to communicate as a group. </p>
            <p>Upload code snippets (which preserve code indentation). </p>
          </div>

          {/* <div className="homepage-footer-group">
            {" "}
            <h4>About</h4>{" "}
            <p> </p>
          </div> */}
        </div>
      </div>
    );
  }
}

export default Landing;
