import React from "react";
import ReactModal from "react-modal";
import { NavLink } from "react-router-dom";
import "./GuestModal.scss";

export default function GuestModal(props) {
  // console.log(props.status);
  return (
    <div className="guest-modal-cont">
      <ReactModal
        isOpen={props.status}
        contentLabel="guest-modal"
        className="GuestModal"
        appElement={document.getElementById("guest-modal-cont")}
        overlayClassName="GuestOverlay">
          <div className="modal-info">
            <h1>You are not logged in!</h1>
            <NavLink className="guest-links" to="/login">Login here</NavLink>
            <h1>or</h1>
            <NavLink className="guest-links" to="server/-LSRXkbdM4Ny08d-3m0k">Checkout the Global Server</NavLink>
          </div>
        </ReactModal>
    </div>
  )
}