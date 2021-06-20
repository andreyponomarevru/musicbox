import React, { Component } from "react";

import { ValidationMsg } from "../validation-msg/validation-msg";
import { InputParser } from "../../utils/input-parser";
import { InputValidator } from "../../utils/input-validator";

import "./add-track-form.scss";
/*
const inputParser = new InputParser();
const validator = new InputValidator();

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onAddTrackClick: (newTrackMetadata: AddTrack) => void;
}

interface State {
  errors: { [key in keyof AddTrackInputNames]: string };
  track: AddTrackInputNames;
}

export class AddTrackForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const track = {
      trackNo: null,
      artist: null,
      title: null,
      genre: null,
      duration: null,
      filePath: null,
      extension: "flac",
      bitrate: 320000,
      diskNo: 1,
    };

    const errors = {
      trackNo: "",
      artist: "",
      title: "",
      genre: "",
      duration: "",
      filePath: "",
      extension: "",
      bitrate: "",
      diskNo: "",
    };

    this.state = {
      track,
      errors,
    };
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const name = e.target.name as keyof AddTrackInputNames;
    const value = e.target.value;
    const errors = this.state.errors;

    switch (name) {
      case "trackNo":
        errors[name] = validator.number(inputParser.number(value), {
          min: 1,
          max: 100,
        })
          ? ""
          : "Track no. must be a valid number between 1 and 100";
        break;
      case "artist":
        errors[name] = validator.array(inputParser.array(value), {
          type: "string",
          items: { min: 1, max: 100 },
        })
          ? ""
          : "List of track artists must be up to 100 characters long";
        break;
      case "title":
        errors[name] = validator.string(value, { min: 1, max: 100 })
          ? ""
          : "Track title must be up to 100 characters long";
        break;
      case "genre":
        errors[name] = validator.array(inputParser.array(value), {
          type: "string",
          items: { min: 1, max: 100 },
        })
          ? ""
          : "List of genres must be up to 100 characters long";
        break;
      case "duration":
        errors[name] = validator.duration(inputParser.seconds(value))
          ? ""
          : "Duration must be a valid time format: hh:mm:ss OR mm:ss";
        break;
      default:
        break;
    }

    this.setState((state, props) => {
      const track = { ...state.track };
      track[name] = value;
      return { errors, track };
    });
  }

  validateForm(errors: State["errors"]) {
    const isNoErrors = Object.values(errors).every(
      (errMsg) => errMsg.length === 0
    );

    const isNotEmpty = Object.values(this.state.track).every((inputVal) => {
      return typeof inputVal === "string" && inputVal.length > 0 ? true : false;
    });

    return isNoErrors && isNotEmpty;
  }

  parseInput(metadata: State["track"]) {
    return {
      trackNo: inputParser.number(metadata.trackNo),
      artist: inputParser.array(metadata.artist),
      title: inputParser.string(metadata.title),
      genre: inputParser.array(metadata.genre),
      duration: inputParser.seconds(metadata.duration),
      filePath: null,
      extension: "flac",
      bitrate: 320000,
      diskNo: 1,
    };
  }

  handleSubmit(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (true /this.validateForm(this.state.errors)/) {
      const parsedTrackMetadata = this.parseInput(this.state.track);

      this.props.onAddTrackClick(parsedTrackMetadata);
      this.setState({
        track: {
          trackNo: null,
          artist: null,
          title: null,
          genre: null,
          duration: null,
          filePath: null,
          extension: null,
          bitrate: null,
          diskNo: null,
        },

        errors: {
          trackNo: "",
          artist: "",
          title: "",
          genre: "",
          duration: "",
          filePath: "",
          extension: "",
          bitrate: "",
          diskNo: "",
        },
      });
    }
  }

  render() {
    const { className = "add-track-form" } = this.props;

    const {
      errors,
      track: { trackNo, artist, title, genre, duration },
    } = this.state;

    return (
      <div className={className}>
        <h1 className="add-release__heading">Tracks</h1>
        <p>Add tracks to release.</p>
        <div className="add-track-form__container">
          <label htmlFor="trackNo">#</label>
          <input
            className="add-track-form__track-no-input"
            type="text"
            name="trackNo"
            id="trackno"
            value={trackNo || ""}
            onChange={this.handleChange.bind(this)}
          />
          <ValidationMsg
            inputVal={trackNo}
            errorMsg={errors.trackNo}
            className="validation-msg add-track-form__validation-msg"
          />
        </div>

        <div className="add-track-form__container">
          <label htmlFor="artist">Artist</label>
          <input
            type="text"
            name="artist"
            id="artist"
            value={artist || ""}
            onChange={this.handleChange.bind(this)}
          />
          <ValidationMsg
            inputVal={artist}
            errorMsg={errors.artist}
            className="validation-msg add-track-form__validation-msg"
          />
        </div>

        <div className="add-track-form__container">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title || ""}
            onChange={this.handleChange.bind(this)}
          />
          <ValidationMsg
            inputVal={title}
            errorMsg={errors.title}
            className="validation-msg add-track-form__validation-msg"
          />
        </div>

        <div className="add-track-form__container">
          <label htmlFor="trackGenre">Genres</label>
          <input
            type="text"
            name="genre"
            id="genre"
            value={genre || ""}
            onChange={this.handleChange.bind(this)}
          />
          <ValidationMsg
            inputVal={genre}
            errorMsg={errors.genre}
            className="validation-msg add-track-form__validation-msg"
          />
        </div>

        <div className="add-track-form__container">
          <label htmlFor="duration">Duration</label>
          <input
            type="text"
            name="duration"
            id="duration"
            className="add-track-form__duration-input"
            value={duration || ""}
            onChange={this.handleChange.bind(this)}
            placeholder="00:00"
          />
          <ValidationMsg
            inputVal={duration}
            errorMsg={errors.duration}
            className="validation-msg add-track-form__validation-msg"
          />
        </div>

        <button
          className="add-track-form__add"
          name="Add"
          onClick={this.handleSubmit.bind(this)}
        >
          Add
        </button>
        <small className="add-track-form__note">
          Separate names in "Artist" and "Genre" fields with ";" symbol
        </small>
      </div>
    );
  }
}
*/
