import React, { Component } from "react";
import * as routes from "../../routes";
import "./Landing.scss";
import { Link } from 'react-router-dom';
import firebase from "../../firebase";

class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      password1: '',
      password2: '',
      isAuth: false
    }
  }

  onChangeHandler = (eTargetName, eTargetValue) => {
    this.setState({ [eTargetName]: eTargetValue });
  };

  render(){ 
    return (
    <div className="ForgotPasswordPage">
      <h1>Forgot Password</h1>
      <input
        type="password"
        className="input"
        name="password"
        onChange={e =>
          this.onChangeHandler(e.target.name, e.target.value)
        }
        value={this.state.password}
      />
      <input
        type="password"
        className="input"
        name="password"
        onChange={e =>
          this.onChangeHandler(e.target.name, e.target.value)
        }
        value={this.state.password}
      />
    </div>
  )}
}

export default ForgotPassword;
