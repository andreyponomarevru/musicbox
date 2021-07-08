import React from "react";

import { toHoursMinSec, toBitrate } from "../../utils/utils";
import "./modal-track.scss";
import { TrackExtendedMetadata, TrackMetadata } from "../../types";

interface Props {
  meta: TrackMetadata;
  className: string;

  togglePlay: (metadata: TrackExtendedMetadata) => void;
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
    <div role="button" tabIndex={0} className={props.className} key={trackId}>
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
