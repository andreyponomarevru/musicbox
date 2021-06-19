import React, { Fragment, useState, useEffect } from "react";

import { Btn } from "./../btn/btn";
import { ModalTrack } from "../modal-track/modal-track";
import "./release.scss";
import { Modal } from "../modal/modal";

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
  const { id, artist, title, coverPath, year, label, catNo } = props.metadata;

  const [isOpen, setIsOpen] = useState(false);

  const [releaseMeta, setReleaseMeta] = useState<ReleaseMetadata | null>(null);
  const [tracksMeta, setTracksMeta] = useState<TrackMetadata[] | null>(null);
  const [err, setErr] = useState<APIError | null>(null);

  useEffect(() => {
    async function fetchReleaseMeta() {
      const apiUrl = `${REACT_APP_API_ROOT}/releases/${props.releaseId}`;
      const { results } = await (await fetch(apiUrl)).json();
      setReleaseMeta(results);
    }

    async function fetchTracksMeta() {
      const apiUrl = `${REACT_APP_API_ROOT}/releases/${props.releaseId}/tracks`;
      const { results } = await (await fetch(apiUrl)).json();
      setTracksMeta(results);
    }

    fetchReleaseMeta();
    fetchTracksMeta();

    return () => {
      setErr(null);
    };
  }, [props.releaseId]);

  function onDeleteClick(e: React.MouseEvent) {
    e.preventDefault();
    // props.onDeleteReleaseBtnClick(props.releaseId);
    setIsOpen(false);
  }

  if (!releaseMeta || !tracksMeta) return null;

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
          />
          <figcaption className="release__caption">
            <strong className="release__title">{title}</strong>
            <span className="release__artist">{artist}</span>
          </figcaption>
        </picture>
      </figure>

      <Modal
        header="Release Details"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="modal__container_release"
      >
        <div className="release__modal">
          <div className="release__modal-content">
            <img
              src={`${REACT_APP_API_ROOT}/${coverPath}`}
              className="release__modal-cover"
              alt=""
            />
            <div className="release__modal-description">
              <span>Artist: </span>
              <span>{artist}</span>
              <span>Title: </span>
              <span>{title}</span>
              <span>Year: </span>
              <span>{year}</span>
              <span>Label: </span>
              <span>{label}</span>
              <span>Catalog: </span>
              <span>{catNo}</span>
            </div>
          </div>

          <div className="release__modal-tracklist">
            {tracksMeta.map((meta) => {
              const className =
                props.playingTrackId === meta.trackId
                  ? "modal-track modal-track__track modal-track_state_playing"
                  : "modal-track modal-track__track";
              return (
                <ModalTrack
                  className={className}
                  meta={meta}
                  key={meta.trackId}
                  togglePlay={props.togglePlay}
                />
              );
            })}
          </div>

          <nav className="release__modal-nav">
            <Btn to={"/release/edit"}>Edit</Btn>
            <Btn to="/" onClick={() => onDeleteClick}>
              Delete
            </Btn>
          </nav>

          {err ? <span>{err}</span> : null}
        </div>
      </Modal>
    </Fragment>
  );
}
