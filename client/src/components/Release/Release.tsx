import React, { Component, Fragment } from "react";
import { NavLink, Route } from "react-router-dom";
import { ReleaseDetailsModal } from "./../ReleaseDetailsModal/ReleaseDetailsModal";

import "./Release.scss";

import { ReleaseMetadata } from "./../../types";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  releaseId: number;
  metadata: ReleaseMetadata;
}

interface State {
  showModal: boolean;
}

class Release extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { showModal: false };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal() {
    document.body.style.overflow = "hidden";
    this.setState({ showModal: true });
  }

  hideModal() {
    document.body.style.overflow = "unset";
    this.setState({ showModal: false });
  }

  render() {
    const { className = "release" } = this.props;
    const { id, artist, title, coverPath } = this.props.metadata;

    return (
      <Fragment>
        <figure className={className} onClick={this.showModal}>
          <picture className="release__wrapper">
            <img className="release__img" src={coverPath} alt={title || ""} />
            <figcaption className="release__caption">
              <strong className="release__title">{title}</strong>
              <span className="release__artist">{artist}</span>
            </figcaption>
          </picture>
        </figure>
        <ReleaseDetailsModal
          releaseId={id}
          showModal={this.state.showModal}
          onModalClose={this.hideModal}
        />
      </Fragment>
    );
  }
}

export { Release };
