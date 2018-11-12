import React from "react";
import { Switch, Route } from "react-router-dom";
import Landing from "./views/Landing/Landing";
import Signup from "./views/Landing/Signup";
import ForgotPassword from "./views/Landing/ForgotPassword";
import Dashboard from "./views/Dashboard/Dashboard";
import Servers from "./views/Servers/Servers";
import DirectMessages from "./views/DirectMessages/DirectMessages";
import Profile from "./views/Profile/Profile";

export default (
  <Switch>
    <Route path="/" exact component={Landing} /> {/* === login page */}
    <Route path="/signup" component={Signup} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/profile" component={Profile} />
    <Route path="/server/:id" component={Servers} />
    <Route path="/direct/:id" component={DirectMessages} />
  </Switch>
);
