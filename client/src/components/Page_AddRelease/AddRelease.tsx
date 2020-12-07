import React, { Component } from "react";

import { NewTrackForm } from "../NewTrackForm/NewTrackForm";
import { AddTrack } from "./../../types";
import { MinSectoSec } from "./../../utils/utils";
import { NewTrack } from "./../NewTrack/NewTrack";

import "./AddRelease.scss";

const { REACT_APP_API_ROOT } = process.env;

interface Props extends React.HTMLAttributes<HTMLFormElement> {}
interface State {
  keyCounter: number;

  release: {
    year: number | string;
    artist: string;
    title: string;
    label: string;
    catNo: string;
    [key: string]: string | number;
  };

  tracklist: AddTrack[];

  errors: {
    [key: string]: string;
  };

  releaseCreated: boolean;
  disableAddTrackForm: boolean;
}

export class AddRelease extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      keyCounter: 0,

      release: {
        year: "",
        artist: "",
        title: "",
        label: "",
        catNo: "",
      },

      tracklist: [],

      errors: {},

      releaseCreated: false,
      disableAddTrackForm: true,
    };
  }

  handleAddTrack(newTrackMetadata: AddTrack) {
    this.setState((state, props) => {
      return {
        tracklist: [...state.tracklist, newTrackMetadata],
      };
    });
  }

  handleReleaseInputChange(
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const inputValue = e.target.value;
    this.setState((state, props) => {
      const release = { ...state.release };
      release[field] = inputValue;
      return { release };
    });
  }

  validateYear() {
    const { release } = this.state;
    const errors = {};
    let isFormValid = true;

    if (
      !release.year ||
      isNaN(Number(release.year)) ||
      Number(release.year) < 0
    ) {
      isFormValid = false;
      Object.assign(errors, {
        year: "Year must be a number",
      });
    }
  }

  handleValidation() {
    const { release } = this.state;
    const errors = {};
    let isFormValid = true;

    if (!release.artist || release.artist.includes(";")) {
      isFormValid = false;
      Object.assign(errors, {
        artist: "Artist can't be empty. Only one artist name is allowed",
      });
    }

    if (!release.title) {
      isFormValid = false;
      Object.assign(errors, {
        title: "Title can't be empty",
      });
    }

    if (!release.label) {
      isFormValid = false;
      Object.assign(errors, {
        label: "Label can't be empty",
      });
    }

    if (!release.catNo) {
      isFormValid = false;
      Object.assign(errors, {
        catNo: "Cat.No. can't be empty",
      });
    }

    this.setState({ errors });
    return isFormValid;
  }

  saveRelease() {
    const releaseMetadata = {
      year: Number(this.state.release.year),
      label: this.state.release.label.trim(),
      catNo: this.state.release.catNo.trim(),
      releaseArtist: this.state.release.artist.trim(),
      releaseTitle: this.state.release.title.trim(),
      tracks: this.state.tracklist,
    };

    fetch(`${REACT_APP_API_ROOT}/releases`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(releaseMetadata),
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({ releaseCreated: false });
      })
      .catch((err) => console.error(err));
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log(this.state);
    e.preventDefault();
    if (this.handleValidation()) this.saveRelease();
  }

  handleDeleteTrackClick(dataKey: number) {
    console.log(dataKey);

    this.setState((state, props) => {
      const newTracklist = [...state.tracklist];
      newTracklist.splice(dataKey, 1);
      return { tracklist: [...newTracklist] };
    });
  }

  // Check whether it works
  componentWillUnmount() {
    this.setState({ releaseCreated: false });
  }

  render() {
    console.log(this.state);

    /*
 const enableAddTrackForm = this.state.release.year.length > 0 

       year: "",
        artist: "",
        title: "",
        label: "",
        catNo: "",

    this.state.disableAddTrackForm = false;
    */

    /*
    if (this.state.tracklist.length === 0) {
      return (
        <div className="add-release">
          <span className="add-release_warning">
            You forgot to add tracks!.
          </span>
        </div>
      );
    }
    */
    if (this.state.releaseCreated) {
      <div className="add-release">
        <span className="add-release_success">
          Release successfully created.
        </span>
      </div>;
    }

    return (
      <form
        className="add-release"
        action="./api/tracks"
        method="POST"
        onSubmit={this.handleSubmit.bind(this)}
        encType="multipart/form-data"
        noValidate
      >
        <div className="add-release__release">
          <h1 className="add-release__heading">Release</h1>

          <div className="add-release__release-form-container">
            <label htmlFor="cover">Cover</label>
            <input
              type="file"
              name="cover"
              id="cover"
              accept="image/png, image/jpeg"
            />
          </div>

          <div className="add-release__release-form-container">
            <label htmlFor="year">Year</label>
            <input
              type="text"
              name="year"
              id="year"
              value={this.state.release.year}
              placeholder={`${new Date().getFullYear()}`}
              onChange={this.handleReleaseInputChange.bind(this, "year")}
              onBlur={this.validateYear.bind(this, "year")}
            />
            {this.state.errors.year ? (
              <span className="add-release_warning">
                {this.state.errors.year}
              </span>
            ) : (
              ""
            )}
          </div>

          <div className="add-release__release-form-container">
            <label htmlFor="releaseartist">Artist</label>
            <input
              type="text"
              name="artist"
              id="releaseArtist"
              value={this.state.release.artist}
              placeholder="Name"
              onChange={this.handleReleaseInputChange.bind(this, "artist")}
            />
            {this.state.errors.artist ? (
              <span className="add-release_warning">
                {this.state.errors.artist}
              </span>
            ) : (
              ""
            )}
          </div>

          <div className="add-release__release-form-container">
            <label htmlFor="releaseTitle">Title</label>
            <input
              type="text"
              name="title"
              id="releasetitle"
              value={this.state.release.title}
              placeholder="Title"
              onChange={this.handleReleaseInputChange.bind(this, "title")}
            />
            {this.state.errors.title ? (
              <span className="add-release_warning">
                {this.state.errors.title}
              </span>
            ) : (
              ""
            )}
          </div>

          <div className="add-release__release-form-container">
            <label htmlFor="label">Label</label>
            <input
              type="text"
              name="label"
              id="label"
              value={this.state.release.label}
              placeholder="White Label"
              onChange={this.handleReleaseInputChange.bind(this, "label")}
            />
            {this.state.errors.label ? (
              <span className="add-release_warning">
                {this.state.errors.label}
              </span>
            ) : (
              ""
            )}
          </div>

          <div className="add-release__release-form-container">
            <label htmlFor="catno">Cat.No.</label>
            <input
              type="text"
              name="catNo"
              id="catno"
              value={this.state.release.catNo}
              placeholder="U-001"
              onChange={this.handleReleaseInputChange.bind(this, "catNo")}
            />
            {this.state.errors.catNo ? (
              <span className="add-release_warning">
                {this.state.errors.catNo}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>

        <br />

        <NewTrackForm onAddTrackClick={this.handleAddTrack.bind(this)} />
        <div className="add-release__tracklist">
          <small className="add-release__note">
            Separate names in "Artist" and "Genre" fields with ";" symbol
          </small>
          {...this.state.tracklist.map((track, index) => {
            const { trackNo, trackArtist, trackTitle, genre, duration } = track;
            return (
              <NewTrack
                trackNo={String(trackNo)}
                trackArtist={trackArtist.join(", ")}
                trackTitle={trackTitle}
                duration={String(duration)}
                genre={genre.join(", ")}
                key={index}
                data-key={index}
                onDeleteTrackClick={this.handleDeleteTrackClick.bind(this)}
              />
            );
          })}
        </div>

        <hr />
        <button>Submit</button>
      </form>
    );
  }
}
