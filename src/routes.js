import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./views/Login/Login";
import Dashboard from "./views/Dashboard/Dashboard";
import Username from "./views/Username/Username";
import Servers from "./views/Servers/Servers";
import DirectMessages from "./views/DirectMessages/DirectMessages";
import Profile from "./views/Profile/Profile";

export default (
  <Switch>
    {/* <Route path="/" exact component={Home} />  */}
    <Route path="/login" component={Login} /> 
    <Route path="/username" component={Username} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/profile" component={Profile} />
    <Route path="/server/:id" component={Servers} />
    <Route path="/direct/:id" component={DirectMessages} />
    <Route path='*' render={() => <div>404 error: Not Found!</div>} />
  </Switch>
);
