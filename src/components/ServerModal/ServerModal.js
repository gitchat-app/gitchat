import React from "react";
import ReactModal from 'react-modal';
import "./ServerModal.scss";

export default function ServerModal(props) {
  const { isOpen, handleCloseModal, name, icon, handleNameInput, handleDescInput, handleIconInput, addServer, toggleDefault,  uploadImage, description } = props;
  return (
    <div id="main-server-modal">
      <ReactModal
        isOpen={isOpen}
        contentLabel="server-modal"
        onRequestClose={handleCloseModal}
        shouldCloseOnEsc={true}
        className="ServerModal"
        appElement={document.getElementById("main-server-modal")}
        overlayClassName="Overlay">
        <button id="close-btn" onClick={() => { handleCloseModal(); toggleDefault() }}>X</button>
        <div className="new-cont">
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
            <label>Description:</label>
            <input
              onChange={handleDescInput}
              value={description}
              type="text"
              required
              placeholder="Enter server descrption"
            />
            <label>Icon URL or Upload Image:</label>
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
            <button type="submit">Add Server</button>
          </div>
        </form>
      </div>
        }       
      </ReactModal>
    </div>
  )
}
