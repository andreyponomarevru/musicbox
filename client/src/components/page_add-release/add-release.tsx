import React, { Component, Fragment } from "react";

import { AddTrackForm } from "../add-track-form/add-track-form";
import {
  AddTrack,
  AddRelease as AddReleaseType,
  AddReleaseInputNames,
  ReleaseMetadata,
} from "../../types";
import { ValidationMsg } from "./../validation-msg/validation-msg";
import { NewTrack } from "../new-track/new-track";
import { InputParser } from "../../utils/input-parser";
import { InputValidator } from "../../utils/input-validator";

import "./add-release.scss";

const inputParser = new InputParser();
const validator = new InputValidator();

const { REACT_APP_API_ROOT } = process.env;

interface Props extends React.HTMLAttributes<HTMLFormElement> {}
interface State {
  release: AddReleaseInputNames;
  errors: { [key in keyof AddReleaseType]: string };
  tracklist: AddTrack[];
  apiResponse: unknown | null;
  disableAddTrackForm: boolean;
}

export class AddRelease extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      release: {
        year: null,
        releaseArtist: null,
        releaseTitle: null,
        label: null,
        catNo: null,
      },
      errors: {
        year: "",
        releaseArtist: "",
        releaseTitle: "",
        label: "",
        catNo: "",
      },
      tracklist: [],
      apiResponse: null,
      disableAddTrackForm: true,
    };
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const name = e.target.name as keyof AddReleaseInputNames;
    const value = e.target.value;
    const errors = this.state.errors;

    switch (name) {
      case "year":
        errors[name] = validator.number(inputParser.number(value), {
          min: 1,
          max: new Date().getFullYear(),
        })
          ? ""
          : "Year must be a valid number";
        break;
      case "releaseArtist":
        errors[name] = validator.string(value, { min: 1, max: 100 })
          ? ""
          : "Release artist name must be up to 100 characters long";
        break;
      case "releaseTitle":
        errors[name] = validator.string(value, { min: 1, max: 100 })
          ? ""
          : "Release Title must be up to 100 characters long";
        break;
      case "label":
        errors[name] = validator.string(value, { min: 1, max: 100 })
          ? ""
          : "Label name must be up to 100 characters long";
        break;
      case "catNo":
        errors[name] = validator.string(value, { min: 1, max: 100 })
          ? ""
          : "Cat. no. must be up to 100 characters long";
        break;
      default:
        break;
    }

    this.setState((state, props) => {
      const release = { ...state.release };
      release[name] = value;
      return { errors, release };
    });
  }

  validateForm(errors: State["errors"]) {
    const isNoErrors = Object.values(errors).every((errMsg) => {
      return errMsg.length === 0;
    });

    const isNotEmpty = Object.values(this.state.release).every((inputVal) => {
      return typeof inputVal === "string" && inputVal.length > 0 ? true : false;
    });

    return isNoErrors && isNotEmpty;
  }

  handleAddTrack(newTrackMetadata: AddTrack) {
    this.setState((state, props) => {
      return {
        tracklist: [...state.tracklist, newTrackMetadata],
      };
    });
  }

  saveReleaseToDB({
    release,
    tracks,
  }: {
    release: AddReleaseType;
    tracks: AddTrack[];
  }) {
    const metadata = {
      ...release,
      tracks,
    };
    console.log(JSON.stringify(metadata));
    fetch(`${REACT_APP_API_ROOT}/releases`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(metadata),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("API POST request response: ", res);
        this.setState({ apiResponse: res });
      })
      .catch((err) => console.error(err));
  }

  parseInput(metadata: State["release"]): AddReleaseType {
    return {
      year: inputParser.number(metadata.year),
      label: inputParser.string(metadata.label),
      catNo: inputParser.string(metadata.catNo),
      releaseArtist: inputParser.string(metadata.releaseArtist),
      releaseTitle: inputParser.string(metadata.releaseTitle),
    };
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (this.validateForm(this.state.errors)) {
      const parsedReleaseMetadata = this.parseInput(this.state.release);
      this.saveReleaseToDB({
        release: parsedReleaseMetadata,
        tracks: this.state.tracklist,
      });
      this.setState({
        release: {
          year: null,
          releaseArtist: null,
          releaseTitle: null,
          label: null,
          catNo: null,
        },
        errors: {
          year: "",
          releaseArtist: "",
          releaseTitle: "",
          label: "",
          catNo: "",
        },
        tracklist: [],
        apiResponse: null,
        disableAddTrackForm: true,
      });
    }
  }

  handleDeleteTrackClick(dataKey: number) {
    this.setState((state, props) => {
      const newTracklist = [...state.tracklist];
      newTracklist.splice(dataKey, 1);
      return { tracklist: [...newTracklist] };
    });
  }

  // Check whether it works
  componentWillUnmount() {
    this.setState({ apiResponse: null });
  }

  render() {
    const {
      year,
      releaseArtist,
      releaseTitle,
      label,
      catNo,
    } = this.state.release;
    const { errors } = this.state;
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
    if (this.state.apiResponse) {
      <div className="add-release">
        <span className="add-release_success">
          Release successfully created.
          {this.state.apiResponse}
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

          <div className="add-release__row">
            <label htmlFor="cover" className="add-release__label">
              Cover
            </label>
            <input
              type="file"
              name="cover"
              id="cover"
              accept="image/png, image/jpeg"
              className="add-release__input"
            />
          </div>

          <div className="add-release__row">
            <label htmlFor="year" className="add-release__label">
              Year
            </label>
            <input
              type="text"
              name="year"
              id="year"
              value={this.state.release.year || ""}
              onChange={this.handleChange.bind(this)}
              className="add-release__input"
            />
            <ValidationMsg
              inputVal={year}
              errorMsg={errors.year}
              className="validation-msg add-track-form__validation-msg"
            />
          </div>

          <div className="add-release__row">
            <label htmlFor="releaseartist" className="add-release__label">
              Artist
            </label>
            <input
              type="text"
              name="releaseArtist"
              id="releaseArtist"
              value={this.state.release.releaseArtist || ""}
              onChange={this.handleChange.bind(this)}
              className="add-release__input"
            />
            <ValidationMsg
              inputVal={releaseArtist}
              errorMsg={errors.releaseArtist}
              className="validation-msg add-track-form__validation-msg"
            />
          </div>

          <div className="add-release__row">
            <label htmlFor="releaseTitle">Title</label>
            <input
              type="text"
              name="releaseTitle"
              id="releasetitle"
              value={this.state.release.releaseTitle || ""}
              onChange={this.handleChange.bind(this)}
            />
            <ValidationMsg
              inputVal={releaseTitle}
              errorMsg={errors.releaseTitle}
              className="validation-msg add-track-form__validation-msg"
            />
          </div>

          <div className="add-release__row">
            <label htmlFor="label">Label</label>
            <input
              type="text"
              name="label"
              id="label"
              value={this.state.release.label || ""}
              onChange={this.handleChange.bind(this)}
            />
            <ValidationMsg
              inputVal={label}
              errorMsg={errors.label}
              className="validation-msg add-track-form__validation-msg"
            />
          </div>

          <div className="add-release__row">
            <label htmlFor="catno">Cat.No.</label>
            <input
              type="text"
              name="catNo"
              id="catno"
              value={this.state.release.catNo || ""}
              onChange={this.handleChange.bind(this)}
            />
            <ValidationMsg
              inputVal={catNo}
              errorMsg={errors.catNo}
              className="validation-msg add-track-form__validation-msg"
            />
          </div>
        </div>

        <AddTrackForm
          onAddTrackClick={this.handleAddTrack.bind(this)}
          className="add-release__add-track-form add-track-form"
        />
        <div className="add-release__tracklist">
          {...this.state.tracklist.map((track, index) => {
            const { trackNo, trackArtist, trackTitle, genre, duration } = track;
            return (
              <NewTrack
                trackNo={String(trackNo)}
                trackArtist={trackArtist.join("; ")}
                trackTitle={trackTitle}
                duration={String(duration)}
                genre={genre.join("; ")}
                key={index}
                data-key={index}
                onDeleteTrackClick={this.handleDeleteTrackClick.bind(this)}
              />
            );
          })}
        </div>

        <button className="add-release__btn">Submit</button>
      </form>
    );
  }
}
