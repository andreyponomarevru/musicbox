import React from "react";

import { Modal } from "../modal/modal";
import { ModalTrack } from "../modal-track/modal-track";
import {
  ReleaseMetadata,
  TrackMetadata,
  TrackExtendedMetadata,
  PaginatedAPIResponse,
} from "../../types";
import { useFetch } from "../../state/useFetch";
import { Loader } from "../loader/loader";

const { REACT_APP_API_ROOT } = process.env;

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  meta: ReleaseMetadata;
  playingTrackId?: number;
  togglePlay: (metadata: TrackExtendedMetadata) => void;
};

export function ReleaseModal(props: Props) {
  const releaseTracks = useFetch<PaginatedAPIResponse<TrackMetadata[]>>(
    `${REACT_APP_API_ROOT}/releases/${props.meta.id}/tracks`
  );

  if (releaseTracks.error) {
    return <div>Oops! Something went wrong: {releaseTracks.error}</div>;
  } else if (releaseTracks.isLoading || !releaseTracks.response) {
    return <Loader />;
  }

  return (
    <Modal
      header="Release Details"
      isOpen={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      className="modal__container_release"
    >
      <div className="release__modal">
        <div className="release__modal-content">
          <img
            src={`${REACT_APP_API_ROOT}/${props.meta.coverPath}`}
            className="release__modal-cover"
            alt=""
            loading="lazy"
          />
          <div className="release__modal-description">
            <span>Artist: </span>
            <span>{props.meta.artist}</span>
            <span>Title: </span>
            <span>{props.meta.title}</span>
            <span>Year: </span>
            <span>{props.meta.year}</span>
            <span>Label: </span>
            <span>{props.meta.label}</span>
            <span>Catalog: </span>
            <span>{props.meta.catNo}</span>
          </div>
        </div>

        <div className="release__modal-tracklist">
          {releaseTracks.response.results.map((meta) => {
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
      </div>
    </Modal>
  );
}
