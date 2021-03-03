import React, { Component, Fragment } from "react";
import axios from "axios";

import { AddTrackForm } from "../add-track-form/add-track-form";
import {
  AddTrack,
  AddRelease as AddReleaseType,
  AddReleaseInputNames,
  ReleaseMetadata,
  TrackMetadata,
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
        artist: null,
        title: null,
        label: null,
        catNo: null,
        cover: null,
      },
      errors: {
        year: "",
        artist: "",
        title: "",
        label: "",
        catNo: "",
        cover: "",
      },
      tracklist: [],
      apiResponse: null,
      disableAddTrackForm: true,
    };
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    let inputName = e.target.name as keyof AddReleaseInputNames;
    let inputValue =
      inputName === "cover" ? e.target.files![0] : e.target.value;
    const errors = this.state.errors;

    /*
    switch (inputName) {
      case "year":
        errors[inputName] = validator.number(inputParser.number(inputValue), {
          min: 1,
          max: new Date().getFullYear(),
        })
          ? ""
          : "Year must be a valid number";
        break;
      case "releaseArtist":
        errors[inputName] = validator.string(inputValue as string, {
          min: 1,
          max: 100,
        })
          ? ""
          : "Release artist name must be up to 100 characters long";
        break;
      case "releaseTitle":
        errors[inputName] = validator.string(inputValue as string, {
          min: 1,
          max: 100,
        })
          ? ""
          : "Release Title must be up to 100 characters long";
        break;
      case "label":
        errors[inputName] = validator.string(inputValue as string, {
          min: 1,
          max: 100,
        })
          ? ""
          : "Label name must be up to 100 characters long";
        break;
      case "catNo":
        errors[inputName] = validator.string(inputValue as string, {
          min: 1,
          max: 100,
        })
          ? ""
          : "Cat. no. must be up to 100 characters long";
        break;
      case "cover":
        errors[inputName] = "";
        break;
      default:
        break;
    }
    */

    this.setState((state, props) => {
      const release = { ...state.release };
      release[inputName] = inputValue;
      console.log(state);
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

  saveReleaseToDB(release: AddReleaseType, tracks: AddTrack[]) {
    const releaseMetadata = {
      artist: release.artist,
      year: release.year,
      title: release.title,
      label: release.label,
      catNo: release.catNo,
    };

    const formData = new FormData();
    formData.append("releaseCover", release.cover);
    formData.append("metadata", JSON.stringify(releaseMetadata));

    // create release
    axios({
      method: "post",
      url: `${REACT_APP_API_ROOT}/releases`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        const releaseId = res.data.results.id;
        console.log("Release successfully created");
        return releaseId;
      })
      .then((releaseId) => {
        // create tracks
        for (let track of tracks) {
          const trackMetadata = {
            releaseId: releaseId,
            filePath: track.filePath,
            extension: track.extension,
            artist: track.artist,
            duration: track.duration,
            bitrate: track.bitrate,
            trackNo: track.trackNo,
            title: track.title,
            diskNo: track.diskNo,
            genre: track.genre,
          };

          axios({
            method: "post",
            url: `${REACT_APP_API_ROOT}/tracks`,
            data: trackMetadata,
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => {
              console.log("Data successfully sent to API.");
              console.log(`API response: ${res}`);
            })
            .catch((err) => {
              console.log("error");
              console.log(err);
            });
        }
      })
      .catch(console.error);

    // Send with 'fetch'
    /*
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
      */
  }

  parseInput(metadata: State["release"]): AddReleaseType {
    return {
      year: inputParser.number(metadata.year),
      label: inputParser.string(metadata.label),
      catNo: inputParser.string(metadata.catNo),
      artist: inputParser.string(metadata.artist),
      title: inputParser.string(metadata.title),
      cover: metadata.cover as File,
    };
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log("handle submit");

    if (true /*this.validateForm(this.state.errors)*/) {
      const releaseMetadata = this.parseInput(this.state.release);
      this.saveReleaseToDB(releaseMetadata, this.state.tracklist);

      this.setState({
        release: {
          year: null,
          artist: null,
          title: null,
          label: null,
          catNo: null,
          cover: null,
        },
        errors: {
          year: "",
          artist: "",
          title: "",
          label: "",
          catNo: "",
          cover: "",
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

  // FIX: Check whether it works
  componentWillUnmount() {
    this.setState({ apiResponse: null });
  }

  render() {
    const { year, artist, title, label, catNo } = this.state.release;
    const { errors } = this.state;

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
              onChange={this.handleChange.bind(this)}
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
              value={(this.state.release.year as string) || ""}
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
              name="artist"
              id="artist"
              value={(this.state.release.artist as string) || ""}
              onChange={this.handleChange.bind(this)}
              className="add-release__input"
            />
            <ValidationMsg
              inputVal={artist}
              errorMsg={errors.artist}
              className="validation-msg add-track-form__validation-msg"
            />
          </div>

          <div className="add-release__row">
            <label htmlFor="releaseTitle">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={(this.state.release.title as string) || ""}
              onChange={this.handleChange.bind(this)}
            />
            <ValidationMsg
              inputVal={title}
              errorMsg={errors.title}
              className="validation-msg add-track-form__validation-msg"
            />
          </div>

          <div className="add-release__row">
            <label htmlFor="label">Label</label>
            <input
              type="text"
              name="label"
              id="label"
              value={(this.state.release.label as string) || ""}
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
              value={(this.state.release.catNo as string) || ""}
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
            const { trackNo, artist, title, genre, duration } = track;
            return (
              <NewTrack
                trackNo={String(trackNo)}
                trackArtist={artist.join("; ")}
                trackTitle={title}
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
