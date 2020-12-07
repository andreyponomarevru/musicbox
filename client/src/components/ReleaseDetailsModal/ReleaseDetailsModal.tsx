import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import icons from "./../../components-img/icons.svg";
import { ReleaseMetadata, TrackMetadata } from "./../../types";
import { toHoursMinSec, toBitrate } from "./../../utils/utils";

import "./ReleaseDetailsModal.scss";

const { REACT_APP_API_ROOT } = process.env;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  showModal: boolean;
  releaseId: number | null;
  onModalClose: () => void;
}
interface State {
  open: boolean;
  releaseMetadata: ReleaseMetadata | null;
  tracksMetadataCollection: TrackMetadata[] | null;
}

class ReleaseDetailsModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      releaseMetadata: null,
      tracksMetadataCollection: null,
    };

    this.handleClose = this.handleClose.bind(this);
  }

  getReleaseMetadata() {
    const { releaseId } = this.props;
    const apiUrl = `${REACT_APP_API_ROOT}/releases/${releaseId}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((res) => {
        if (res.hasOwnProperty("errorCode")) {
          throw new Error(`${apiUrl}: ${res.message}`);
        } else {
          return res;
        }
      })
      .then((res) => {
        this.setState({ releaseMetadata: res });
      });
  }

  handleClose() {
    this.setState({ open: false });
    this.props.onModalClose();
  }

  getTracksMetadata() {
    const { releaseId } = this.props;
    const apiUrl = `${REACT_APP_API_ROOT}/releases/${releaseId}/tracks`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((res) => {
        if (res.hasOwnProperty("errorCode")) {
          throw new Error(`${apiUrl}: ${res.message}`);
        } else {
          return res;
        }
      })
      .then((res) => {
        this.setState({ tracksMetadataCollection: res });
      });
  }

  componentDidMount() {
    if (this.state.open) document.body.style.overflow = "hidden";

    this.getReleaseMetadata();
    this.getTracksMetadata();
  }

  componentWillUnmount() {
    document.body.style.overflow = "unset";
  }

  render() {
    if (!this.props.showModal) return null;

    const showHideClassName = this.props.showModal
      ? "release-details-modal release-details-modal_active"
      : "release-details-modal";

    if (this.state.releaseMetadata && this.state.tracksMetadataCollection) {
      const tracksJSX = this.state.tracksMetadataCollection?.map(
        (trackMetadata) => {
          const {
            trackNo,
            trackArtist,
            trackTitle,
            genre,
            duration,
            bitrate,
            extension,
            filePath,
          } = trackMetadata;
          console.log(bitrate);
          return (
            <div
              className="release-details-modal__track"
              key={trackMetadata.trackId}
            >
              <span className="release-details-modal__track-no">{trackNo}</span>
              <span className="release-details-modal__artist">
                {trackArtist.join(", ")}
              </span>
              <span className="release-details-modal__track-title">
                {trackTitle}
              </span>
              <span className="release-details-modal__genres">
                {genre.join(", ")}
              </span>
              <span className="release-details-modal__bitrate">
                {bitrate ? toBitrate(bitrate) : "—"}
              </span>
              <span className="release-details-modal__extension">
                {extension || "—"}
              </span>
              <span className="release-details-modal__duration">
                {toHoursMinSec(duration)}
              </span>
            </div>
          );
        }
      );

      const {
        year,
        artist,
        title,
        label,
        catNo,
        coverPath,
      } = this.state.releaseMetadata;

      return (
        <div className={showHideClassName}>
          <section className="release-details-modal__container">
            <header className="release-details-modal__header">
              <span className="release-details-modal__heading">
                Release Details
              </span>
              <span
                className="release-details-modal__close-btn"
                onClick={this.handleClose}
              >
                &#10006;
              </span>
            </header>
            <hr className="release-details-modal__hr" />
            <main className="release-details-modal__content">
              <img src={coverPath} className="release-details-modal__cover" />
              <ul className="release-details-modal__details">
                <li className="release-details-modal__title">
                  {artist} - {title}
                </li>
                <li>
                  <strong>Year: </strong>
                  <span>{year}</span>
                </li>
                <li>
                  <strong>Label: </strong>
                  <span>
                    {label} — {catNo}
                  </span>
                </li>
              </ul>
              <div className="release-details-modal__tracklist">
                {tracksJSX}
              </div>
            </main>
            <NavLink
              to="/release/edit"
              className="release-details-modal__edit-btn add-release-btn add-release-btn_theme_empty"
            >
              Edit Release
            </NavLink>
          </section>
        </div>
      );
    } else return null;
  }
}

export { ReleaseDetailsModal };
