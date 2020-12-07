import React, { Component } from "react";

import { AddTrack } from "./../../types";
import "./NewTrackForm.scss";
import { MinSectoSec } from "./../../utils/utils";
import { ValidationMsg } from "./../ValidationMsg/ValidationMsg";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onAddTrackClick: (newTrackMetadata: AddTrack) => void;
}

type TrackInputNames =
  | "trackNo"
  | "trackArtist"
  | "trackTitle"
  | "genre"
  | "duration"
  | string;

interface State {
  errors: { [key in TrackInputNames]: string };
  track: { [key in TrackInputNames]: string | null };
}

export class NewTrackForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const track = {
      trackNo: null,
      trackArtist: null,
      trackTitle: null,
      genre: null,
      duration: null,
    };
    const errors = {
      trackNo: "",
      trackArtist: "",
      trackTitle: "",
      genre: "",
      duration: "",
    };

    this.state = {
      track,
      errors,
    };
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const { name, value } = e.target;
    const errors = this.state.errors;

    switch (name) {
      case "trackNo":
        const trackNo = Number(value);
        errors[name] =
          !trackNo || trackNo > 100 || trackNo <= 0
            ? "Track No. must be a valid number between 1 and 100"
            : "";
        break;
      case "trackArtist":
        errors[name] =
          value.length > 100 || value.length === 0
            ? "List of track artists must be up to 100 characters long"
            : "";
        break;
      case "trackTitle":
        errors[name] =
          value.length > 100
            ? "Track Title must be up to 100 characters long"
            : "";
        break;
      case "genre":
        errors[name] =
          value.length > 100
            ? "List of genres must be up to 100 characters long"
            : "";
        break;
      case "duration":
        const duration = MinSectoSec(value);
        errors[name] = !duration
          ? "Duration must be a valid time format: hh:mm:ss OR mm:ss"
          : "";
        break;
      default:
        break;
    }

    this.setState((state, props) => {
      const track = { ...state.track } as State["track"];
      track[name] = value;
      return { errors, track };
    });
  }

  validateForm(errors: State["errors"]) {
    const isNoErrors = Object.values(errors).every(
      (errMsg) => errMsg!.length === 0
    );

    const isFormFilled = Object.values(this.state.track).every((inputVal) => {
      return typeof inputVal === "string" && inputVal.length > 0 ? true : false;
    });

    if (isNoErrors && isFormFilled) return true;
    else return false;
  }

  parseInput(metadata: State["track"]) {
    return {
      trackNo: Number(metadata.trackNo),
      trackArtist: metadata.trackArtist!.split("; "),
      trackTitle: metadata.trackTitle!,
      genre: metadata.genre!.split("; "),
      duration: MinSectoSec(metadata.duration!)!,
    };
  }

  handleSubmit(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (this.validateForm(this.state.errors)) {
      const parsedTrackMetadata = this.parseInput(this.state.track);

      this.props.onAddTrackClick(parsedTrackMetadata);
      this.setState({
        track: {
          trackNo: null,
          trackArtist: null,
          trackTitle: null,
          genre: null,
          duration: null,
        },
        errors: {
          trackNo: "",
          trackArtist: "",
          trackTitle: "",
          genre: "",
          duration: "",
        },
      });
    }
  }

  render() {
    console.log(this.state);
    const {
      errors,
      track: { trackNo, trackArtist, trackTitle, genre, duration },
    } = this.state;

    return (
      <div className="new-track-form">
        <h1 className="add-release__heading">Tracks</h1>
        <div className="new-track-form__container">
          <label htmlFor="trackNo">#</label>
          <input
            className="new-track-form__track-no-input"
            type="text"
            name="trackNo"
            id="trackno"
            value={trackNo || ""}
            onChange={this.handleChange.bind(this)}
            placeholder="1"
          />
          <ValidationMsg
            inputVal={trackNo}
            errorMsg={errors.trackNo}
            successMsg="OK"
            className={`validation-msg ${
              errors.trackNo.length > 0
                ? "validation-msg_warning"
                : "validation-msg success"
            }`}
          />
        </div>

        <div className="new-track-form__container">
          <label htmlFor="trackArtist">Artist</label>
          <input
            type="text"
            name="trackArtist"
            id="trackartist"
            value={trackArtist || ""}
            onChange={this.handleChange.bind(this)}
            placeholder="Artist1; Artist2"
          />
          <ValidationMsg
            inputVal={trackArtist}
            errorMsg={errors.trackArtist}
            successMsg="OK"
            className="new-track-form warning"
          />
        </div>

        <div className="new-track-form__container">
          <label htmlFor="trackTitle">Title</label>
          <input
            type="text"
            name="trackTitle"
            id="tracktitle"
            value={trackTitle || ""}
            placeholder="Title"
            onChange={this.handleChange.bind(this)}
          />
          <ValidationMsg
            inputVal={trackTitle}
            errorMsg={errors.trackTitle}
            successMsg="OK"
          />
        </div>

        <div className="new-track-form__container">
          <label htmlFor="trackGenre">Genres</label>
          <input
            type="text"
            name="genre"
            id="genre"
            value={genre || ""}
            onChange={this.handleChange.bind(this)}
            placeholder="Genre1; Genre2"
          />
          <ValidationMsg
            inputVal={genre}
            errorMsg={errors.genre}
            successMsg="OK"
          />
        </div>

        <div className="new-track-form__container">
          <label htmlFor="duration">Duration</label>
          <input
            type="text"
            name="duration"
            id="duration"
            className="new-track-form__duration-input"
            value={duration || ""}
            onChange={this.handleChange.bind(this)}
            placeholder="00:00:00"
          />
          <ValidationMsg
            inputVal={duration}
            errorMsg={errors.duration}
            successMsg="OK"
          />
        </div>

        <button
          className="new-track-form__add"
          name="Add"
          onClick={this.handleSubmit.bind(this)}
        >
          Add
        </button>
      </div>
    );
  }
}
