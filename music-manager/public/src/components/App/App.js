import React, { Component } from "react";
import PropTypes from "prop-types";
import "./App.scss";
import HeaderBar from "../HeaderBar/HeaderBar";
import SidebarMenu from "../SidebarMenu/SidebarMenu";
import FilterBar from "./../FilterBar/FilterBar";
import ReleasesGrid from "./../ReleasesGrid/ReleasesGrid";
import AudioPlayer from "./../AudioPlayer/AudioPlayer";
import "./../Modal/Modal.scss";
import "./../ErrorBoundary/ErrorBoundary";
import findMatchingTracks from "../../utils/findMatchingTracks.js";
import ThemeContext from "./ThemeContext";

import sidebarMenuItems from "../../api/sidebar-json";
import tracks from "./../../api/tracks-json";

/*
const APItracks = fetch('http://localhost:3002/id=5')
.then(res => {
  console.log(res);
  return res.json();
})
.then(res => {
  console.log(res);
})
.catch(err => console.log(err));
*/

class App extends Component {
  #test = 5;
  constructor(props) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.state = {
      selectedOptions: {
        year: ["All"],
        artist: ["All"],
        album: ["All"],
        label: ["All"],
        genre: ["All"],
      },
    };
    console.log("State from constructor", this.state);
  }

  handleSelectChange(e) {
    // We need to save e.target.value right here, outside of setState callback.
    // Otherwise React will throw an error.
    //
    // The reason is that setState always called asynchronously, thus, at the
    // moment of updateSelectedOptions and updateFilteredTracks invocation the
    // syntetic event object which is used inside these functions is already
    // nullified and we can't use it
    const selectedOption = e.target.value;
    const selectName = e.target.name;

    function updateFilteredTracks(state) {
      let newState = { ...state }; // make a shallow copy of old state
      newState.filteredTracks = findMatchingTracks(
        tracks,
        newState.selectedOptions
      );

      return newState;
    }

    function updateSelectedOptions(state) {
      const selectedOptions = state.selectedOptions[selectName];
      const isSelected = selectedOptions.includes(selectedOption);

      const newState = {};
      newState.selectedOptions = { ...state.selectedOptions };

      if (selectedOption === "All") {
        newState.selectedOptions[selectName] = [selectedOption];
      } else if (isSelected && selectedOptions.length >= 1) {
        newState.selectedOptions[selectName] = newState.selectedOptions[
          selectName
        ].filter(opt => opt !== selectedOption);
      } else {
        if (selectedOptions.includes("All")) {
          newState.selectedOptions[selectName] = newState.selectedOptions[
            selectName
          ].filter(opt => opt !== "All");
        }

        newState.selectedOptions[selectName].push(selectedOption);
      }

      return newState;
    }

    this.setState(updateSelectedOptions, () =>
      console.log("Update Selected Options: ", this.state)
    );
    this.setState(updateFilteredTracks, () =>
      console.log("Update Filtered Tracks: ", this.state.filteredTracks)
    );
  }

  componentDidMount() {
    // TODO:
    // Put API calls here:
    // https://reactjs.org/docs/faq-ajax.html#where-in-the-component-lifecycle-should-i-make-an-ajax-call
    //
    // Check the end of tutorial with the example of API calls:
    // https://www.taniarascia.com/getting-started-with-react/

    // getAvailabelYears
    fetch('http://localhost:3002/years')
      .then(res => {
        return new Promise((resolve, reject) => {
          setTimeout( () => resolve(res.json()), 1000);
        });
      })
      .then(
        (result) => this.setState({ years: result, yearsIsLoaded: true }),
        (error) => this.setState({ yearsIsLoaded: true, yearsError: error })
      );

    // getAvailableGenres
    fetch('http://localhost:3002/genres')
      .then(res => {
        return new Promise((resolve, reject) => {
          setTimeout( () => resolve(res.json()), 1000);
        });
      })
      .then(
        (result) => this.setState({ genres: result, genresIsLoaded: true }),
        (error) => this.setState({ genresIsLoaded: true, genresError: error })
      );

    // getAvailableArtists
    fetch('http://localhost:3002/artists')
      .then(res => {
        return new Promise((resolve, reject) => {
          setTimeout( () => resolve(res.json()), 1000);
        });
      })
      .then(
        (result) => this.setState({ artists: result, artistsIsLoaded: true }),
        (error) => this.setState({ artistsIsLoaded: true, artistsError: error })
      );  

    // getAvailableAlbums
    fetch('http://localhost:3002/albums')
      .then(res => {
        return new Promise((resolve, reject) => {
          setTimeout( () => resolve(res.json()), 1000);
        });
      })
      .then(
        (result) => this.setState({ albums: result, albumsIsLoaded: true }),
        (error) => this.setState({ albumsIsLoaded: true, albumsError: error })
      );

    // getAvailableLabels
    fetch('http://localhost:3002/labels')
      .then(res => {
        return new Promise((resolve, reject) => {
          setTimeout( () => resolve(res.json()), 1000);
        });
      })
      .then(
        (result) => this.setState({ labels: result, labelsIsLoaded: true }),
        (error) => this.setState({ labelsIsLoaded: true, labelsError: error })
      );
  }


  // TODO:
  // All these getters imitate requests to API.
  // Replace all of them with actual queries to API
  // Or maybe delete these functions completely?
  /*
  getTracksByYear(years) {
    // - Move this logic to backend:
    // - 'source' is the results of previously applied filter;
    //console.log("Source: ", years);
    function processRequest(years) {
      if (years.includes("All")) return tracks;
      else {
        return tracks.filter(track => years.includes(track.year));
      }
    }
    // -

    const response = processRequest(years);
    // console.log("getTracksByYear Response: ", response);
    return response;
  }

  getTracksByGenre(genres) {
    //console.log("Source: ", genres);
    function processRequest(genres) {
      if (genres.includes("All")) return tracks;
      else {
        return tracks.filter(track => {
          for (const genre of genres) {
            if (track.genre.includes(genre)) return true;
          }
          return false;
        });
      }
    }
    // -

    const response = processRequest(genres);
    // console.log("getTracksByGenre Response: ", response);
    return response;
  }

  getTracksByArtist(artists) {
    // Mode this logic to backend:
    function processRequest(artists) {
      if (artists.includes("All")) return tracks;
      else {
        return tracks.filter(track => {
          for (const artist of artists) {
            if (track.artist.includes(artist)) return true;
          }
          return false;
        });
      }
    }
    // -

    const response = processRequest(artists);
    //console.log("getTracksByArtist Response: ", response);
    return response;
  }

  getTracksByAlbum(albums) {
    // Mode this logic to backend:
    function processRequest(albums) {
      if (albums.includes("All")) return tracks;
      else {
        return tracks.filter(track => {
          for (const album of albums) {
            if (track.album.includes(album)) return true;
          }
          return false;
        });
      }
    }
    // -

    const response = processRequest(albums);
    // console.log("getTracksByAlbum Response: ", response);
    return response;
  }

  getTracksByLabel(labels) {
    // Mode this logic to backend:
    function processRequest(labels) {
      if (labels.includes("All")) return tracks;
      else {
        return tracks.filter(track => {
          for (const label of labels) {
            if (track.label.includes(label)) return true;
          }
          return false;
        });
      }
    }
    // -

    const response = processRequest(labels);
    //console.log("getTracksByLabel Response: ", response);
    return response;
  }
  */


  render() {
    const yearsBar = (() => {
      const { years, yearsIsLoaded, yearsError } = this.state;

      if (yearsError) <div>Error: {yearsError.message}</div>;
      else return (
        <FilterBar
          className="FilterBar"
          name="year"
          options={yearsIsLoaded ? years : ['Loading...']}
          onSelectChange={this.handleSelectChange}
        />);
    })();
    
    const genresBar = (() => {
      const { genres, genresIsLoaded, genresError } = this.state;

      if (genresError) <div>Error: {genresError.message}</div>;
      else return (
        <FilterBar
          className="FilterBar"
          name="genre"
          options={genresIsLoaded ? genres : ['Loading...']}
          onSelectChange={this.handleSelectChange}
        />);
    })();

    const artistsBar = (() => {
      const { artists, artistsIsLoaded, artistsError } = this.state;

      if (artistsError) <div>Error: {artistsError.message}</div>;
      else return (
        <FilterBar
          className="FilterBar"
          name="artist"
          options={artistsIsLoaded ? artists : ['Loading...']}
          onSelectChange={this.handleSelectChange}
        />);
    })();

    const albumsBar = (() => {
      const { albums, albumsIsLoaded, albumsError } = this.state;

      if (albumsError) <div>Error: {albumsError.message}</div>;
      else return (
        <FilterBar
          className="FilterBar"
          name="album"
          options={albumsIsLoaded ? albums : ['Loading...']}
          onSelectChange={this.handleSelectChange}
        />);
    })();

    const labelsBar = (() => {
      const { labels, labelsIsLoaded, labelsError } = this.state;

      if (labelsError) <div>Error: {labelsError.message}</div>;
      else return (
        <FilterBar
          className="FilterBar"
          name="label"
          options={labelsIsLoaded ? labels : ['Loading...']}
          onSelectChange={this.handleSelectChange}
        />);
    })();

    return (
      <div className={this.props.className}>
        <HeaderBar className="HeaderBar" />
        <SidebarMenu className="SidebarMenu" items={sidebarMenuItems} />
        <ThemeContext.Provider value="light">
        {yearsBar} {genresBar} {artistsBar} {albumsBar} {labelsBar}
        </ThemeContext.Provider>
        <ReleasesGrid className="ReleasesGrid" />
        <AudioPlayer className="AudioPlayer" />
      </div>
    );
    
  }

  static propTypes = {
    className: PropTypes.string
  };
}

export default App;
