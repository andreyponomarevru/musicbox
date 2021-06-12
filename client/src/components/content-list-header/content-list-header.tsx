import React from "react";

import "./content-list-header.scss";

interface Props {
  className?: string;
}

export function ContentListHeader(props: Props) {
  const { className = "" } = props;

  return (
    <div className={`content-list-header ${className}`}>
      <span></span>
      <span>Year</span>
      <span>Artist</span>
      <span>Track</span>
      <span>Album</span>
      <span>Genre</span>
      <span>Length</span>
      <span>Bitrate</span>
      <span>Ext.</span>
      <span></span>
    </div>
  );
}
