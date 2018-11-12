import React, { Component } from "react";
import * as routes from "../../routes";
import "./Landing.scss";
import { Link } from 'react-router-dom';
import firebase from "../../firebase";

class ForgotPassword extends Component {

  render(){ 
    return (
    <div className="ForgotPasswordPage">
      <h1>Change Password</h1>
      

      <h1>Reset Password</h1>
    </div>
  )}
}

export default ForgotPassword;
