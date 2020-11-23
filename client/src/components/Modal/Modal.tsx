import React, { Component } from "react";

import icons from "./../../components-img/icons.svg";

import "./Modal.scss";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  show: boolean;
  handleClose: () => void;
  content: JSX.Element[];
}
interface ModalState {
  open: boolean;
}

class Modal extends Component<ModalProps, ModalState> {
  constructor(props: ModalProps) {
    super(props);
    this.state = { open: false };
  }

  componentDidMount() {
    if (this.state.open) document.body.style.overflow = "hidden";
  }

  componentWillUnmount() {
    document.body.style.overflow = "unset";
  }

  render() {
    const showHideClassName = this.props.show ? "modal modal_active" : "modal";

    return (
      <div className={showHideClassName}>
        <section className="modal__container">
          <header className="modal__header">
            <h1 className="modal__heading">{this.props.name}</h1>
            <svg className="modal__close-btn" onClick={this.props.handleClose}>
              <use href={`${icons}#close`} />
            </svg>
          </header>
          <hr className="modal__hr" />
          <main className="modal__content"> {this.props.content}</main>
        </section>
      </div>
    );
  }
}

export { Modal };
