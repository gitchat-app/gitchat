import React, { Component } from "react";

class ActiveButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false
    };

    this.toggleClass = this.toggleClass.bind(this);
  }
  toggleClass() {
    // const currentState = this.state.active;
    this.setState({ active: !this.state.active });
    console.log("this.state", this.state);
  }

  render() {
    console.log("this.state", this.state);
    return (
      <div
        className={
          this.state.active
            ? `${this.props.buttonType}-button-active`
            : `${this.props.buttonType}-button`
        }
        onClick={this.toggleClass}
      >
        <p>{this.props.channelName}</p>
        BUTTON
      </div>
    );
  }
}

export default ActiveButton;
