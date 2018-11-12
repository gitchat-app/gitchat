import React, { Component } from "react";
import * as routes from "../../routes";
import "./Landing.scss";
import firebase from "../../firebase";
import { Link } from 'react-router-dom';

class Landing extends Component {
  constructor() {
    super();
    this.state = {
      emailAddress: "",
      password: "",
      isAuth: false
    };
  }

  login = () => {
    
  };

  onChangeHandler = (eTargetName, eTargetValue) => {
    this.setState({ [eTargetName]: eTargetValue });
  };

  render() {
    return (
      <div className="outerMostLoginWrapper">
        <div>
        <h1>gitChat</h1>
        <br />

        <div className="loginBox">
          <h1>Login </h1>
          <div>
            <input
              type="text"
              className="input"
              name="emailAddress"
              onChange={e =>
                this.onChangeHandler(e.target.name, e.target.value)
              }
              value={this.state.emailAddress}
              placeholder="Email Address"
            />
          </div>
          <div>
            <input
              type="text"
              className="input"
              name="password"
              onChange={e =>
                this.onChangeHandler(e.target.name, e.target.value)
              }
              value={this.state.password}
              placeholder="Password"
            />
          </div>
          <br />
          <button className="login-button" onClick={()=> this.login() }>
            Login
          </button> 
          
          
        </div>
        
        <br />
        <div>
          <Link to='../../forgot-password'>Forgot Password?</Link>
        </div>

        <div>
          <br />
          <h4>
            Don't have an account? &nbsp;
            <Link to='../../signup'>Sign Up</Link>
          </h4>
        </div>
        </div>
      </div>
    );
  }
}

export default Landing;
