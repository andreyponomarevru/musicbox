import React, { Component } from "react";

import { toHoursMinSec } from "./../../utils/utils";

import "./NewTrack.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  trackNo: string;
  trackArtist: string;
  trackTitle: string;
  genre: string;
  duration: string;

  "data-key": number;
  onDeleteTrackClick: (e: any) => void;
}

export class NewTrack extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleDeleteBtnClick = this.handleDeleteBtnClick.bind(this);
  }

  handleDeleteBtnClick(e: any) {
    this.props.onDeleteTrackClick(e.target.getAttribute("data-key"));
  }

  render() {
    return (
      <div className="new-track">
        <span>{this.props.trackNo}</span>
        <span>{this.props.trackArtist}</span>
        <span>{this.props.trackTitle}</span>
        <span>{this.props.genre}</span>
        <span>{toHoursMinSec(Number(this.props.duration))}</span>
        <button
          type="button"
          className="new-track__delete-btn"
          name="Delete"
          onClick={this.handleDeleteBtnClick}
          data-key={this.props["data-key"]}
        >
          Delete
        </button>
      </div>
    );
  }
}
