import React, { Component } from "react";
import "./DirectMessages.scss";

// import MessageCard from "../../components/MessageCard/MessageCard";

import DirectMessageSidebar from "../../components/DirectMessageSidebar/DirectMessageSidebar";

import DMChat from "../../components/DMChat/DMChat";

import firebase from "../../firebase";

//notes: make the url for the dm just direct/idOfRecipient and pull it in via match.params and the current user in the componentDidMount and order them alphabetically and save that to state as the id for dms

//to have a list of dms, consider having openDMs as an object on each member that will always have the most recent message and timestamp on it (so you can see everyone you have a dm with and they can be ordered by how recent they are)
//this will need to update the dm for both user objects with the other user's id

class DirectMessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // currentUserId: null
    };
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props !== prevProps) {
  //     console.log("NEW PROPS");

  //     // this.setState
  //     //needs to change the dmKey in state

  //     this.getMessages();
  //   }
  //   this.scrollToBottom({ block: "end", behavior: "smooth" });
  // }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          // console.log("user", user);
          console.log("this.props", this.props);

          this.setState({ currentUserId: user.uid });
        } else {
          // No user is signed in.
          console.log("NO USER");
        }
      }.bind(this)
    );
  }

  render() {
    console.log("this.state", this.state);
    return (
      <div className="dm-component">
        <DirectMessageSidebar />

        <DMChat
          // currentUserId={this.state.currentUserId}
          currentUrlParams={this.props.match.params.id}
        />
      </div>
    );
  }
}

export default DirectMessages;
