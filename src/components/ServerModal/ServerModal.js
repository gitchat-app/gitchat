import React from "react";
import ReactModal from 'react-modal';
import "./ServerModal.scss";

export default function ServerModal(props) {
  const { isOpen, handleCloseModal, name, icon, handleNameInput, handleIconInput, addServer, modalState, toggleNew, toggleJoin, toggleDefault, addMember, uploadImage } = props;
  return (
    <div id="main-server-modal">
      <ReactModal
        isOpen={isOpen}
        contentLabel="server-modal"
        onRequestClose={handleCloseModal}
        shouldCloseOnEsc={true}
        className="Modal"
        appElement={document.getElementById("main-server-modal")}
        overlayClassName="Overlay">
        <button id="close-btn" onClick={() => { handleCloseModal(); toggleDefault() }}>X</button>
        {modalState === "default" 
          ? <div className="default-cont">
            <div className="server-btn-cont">
              <h1>New Server</h1>
              <p>Create your own server to invite friends!</p>
              <button onClick={toggleNew}>Create</button>
            </div>
            <h1>or</h1>
            <div className="server-btn-cont">
              <h1>Join Server</h1>
              <p>Join a server to chat with friends!</p>
              <button onClick={toggleJoin}>Join</button>
            </div>
          </div>
          : modalState === "new"
          ? <div className="new-cont">
            <h1>Add Server</h1>
            <form onSubmit={addServer}>
              <div className="server-input-cont">
                <label>Server:</label>
                <input
                  onChange={handleNameInput}
                  value={name}
                  type="text"
                  required
                  placeholder="Enter server name"
                />
                <label>Icon URL:</label>
                <input
                  onChange={handleIconInput}
                  value={icon}
                  type="text"
                  required
                  placeholder="Enter server icon URL"
                />
                <input
                  type="file"
                  id="uploader"
                  onChange={e => uploadImage(e)}
                />
              </div>
              <div className="add-server-btn-cont">
                <button onClick={toggleDefault}>Back</button>
                <button type="submit">Add Server</button>
              </div>
            </form>
          </div>
          : <div className="new-cont">
            <h1>Join Server</h1>
            <form onSubmit={addMember}>
              <div className="server-input-cont">
                <label>Server:</label>
                <input
                  onChange={handleNameInput}
                  value={name}
                  type="text"
                  required
                  placeholder="Enter server name"
                />
              </div>
              <div className="add-server-btn-cont">
                <button onClick={toggleDefault}>Back</button>
                <button type="submit">Join Server!</button>
              </div>
            </form>
          </div>
        }       
      </ReactModal>
    </div>
  )
}
