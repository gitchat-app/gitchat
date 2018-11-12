import React from "react";
import { Switch, Route } from "react-router-dom";
import Landing from "./views/Landing/Landing";
import Dashboard from "./views/Dashboard/Dashboard";
import Servers from "./views/Servers/Servers";
import DirectMessages from "./views/DirectMessages/DirectMessages";
import Profile from "./views/Profile/Profile";

export default (
  <Switch>
    <Route path="/" exact component={Landing} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/profile" component={Profile} />
    <Route path="/server/:id" component={Servers} />
    <Route path="/direct/:id" component={DirectMessages} />
  </Switch>
);
