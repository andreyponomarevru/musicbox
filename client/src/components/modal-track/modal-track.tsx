import React from "react";

import { toHoursMinSec, toBitrate } from "../../utils/utils";
import { TrackMetadata } from "../../types";
import "./modal-track.scss";

interface Props {
  meta: TrackMetadata;
}

export function ModalTrack(props: Props) {
  const {
    trackId,
    trackNo,
    artist,
    title,
    genre,
    bitrate,
    extension,
    duration,
  } = props.meta;

  return (
    <div className="modal-track__track" key={trackId}>
      <span className="modal-track__track-no">{trackNo}</span>
      <span className="modal-track__artist">{artist.join(", ")}</span>
      <span className="modal-track__title">{title}</span>
      <span className="modal-track__genres">{genre.join(", ")}</span>
      <span className="modal-track__bitrate">
        {bitrate ? toBitrate(bitrate) : "—"}
      </span>
      <span className="modal-track__extension">{extension || "—"}</span>
      <span className="modal-track__duration">{toHoursMinSec(duration)}</span>
    </div>
  );
}
