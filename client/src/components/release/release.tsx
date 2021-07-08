import React, { Fragment, useState } from "react";

import "./release.scss";
import { TrackExtendedMetadata, ReleaseMetadata } from "../../types";
import { ReleaseModal } from "../release-modal/release-modal";

const { REACT_APP_API_ROOT } = process.env;

interface Props {
  releaseId: number;
  metadata: ReleaseMetadata;

  togglePlay: (metadata: TrackExtendedMetadata) => void;
  playingTrackId?: number;

  className?: string;
}

export function Release(props: Props): JSX.Element | null {
  const { className = "" } = props;
  const { artist, title, coverPath } = props.metadata;
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) document.body.style.overflow = "hidden";
  else document.body.style.overflow = "unset";

  return (
    <Fragment>
      <figure
        className={`release ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <picture className="release__wrapper">
          <img
            className="release__img"
            src={`${REACT_APP_API_ROOT}/${coverPath}`}
            alt={title || ""}
            loading="lazy"
          />
          <figcaption className="release__caption">
            <strong className="release__title">{title}</strong>
            <span className="release__artist">{artist}</span>
          </figcaption>
        </picture>
      </figure>
      {isOpen ? (
        <ReleaseModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          playingTrackId={props.playingTrackId}
          togglePlay={props.togglePlay}
          meta={props.metadata}
        />
      ) : null}
    </Fragment>
  );
}
