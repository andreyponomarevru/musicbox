import React, { Component } from "react";
import PropTypes from "prop-types";
import "./App.scss";
import HeaderBar from "../HeaderBar/HeaderBar";
import SidebarMenu from "../SidebarMenu/SidebarMenu";
import FilterBar from "./../FilterBar/FilterBar";
import ReleasesGrid from "./../ReleasesGrid/ReleasesGrid";
import AudioPlayer from "./../AudioPlayer/AudioPlayer";
import Modal from "./../Modal/Modal";
import "./../Modal/Modal.scss";

import sidebarMenuItems from "../../api/sidebar-json";
import tracks from "./../../api/tracks-json";

class App extends Component {
  constructor(props) {
    super(props);
  }

  // TODO:
  // All these getters imitate requests to DB.
  // Replace all of them with actual queries to DB

  getYears(database) {
    const years = [];
    database.forEach(track => {
      const year = parseFloat(track.year);
      if (!years.includes(year)) years.push(year);
    });
    years.sort();
    return years;
  }

  getGenres(database) {
    const genres = [];
    database.forEach(track => {
      const trackGenres = track.genre;
      // if the tracks has more than one genre assigned:
      trackGenres.forEach(genre => {
        if (!genres.includes(genre)) genres.push(genre);
      });
    });
    genres.sort();
    return genres;
  }

  getArtists(database) {
    const artists = [];
    database.forEach(track => {
      const trackArtists = track.artist;
      trackArtists.forEach(artist => {
        if (!artists.includes(artist)) artists.push(artist);
      });
    });
    artists.sort();
    return artists;
  }

  getAlbums(database) {
    const albums = [];
    database.forEach(track => {
      const album = track.album;
      if (!albums.includes(album)) albums.push(album);
    });
    return albums;
  }

  getLabels(database) {
    const labels = [];
    database.forEach(track => {
      const label = track.label;
      if (!labels.includes(label)) labels.push(label);
    });
    return labels;
  }

  render() {
    return (
      <div className={this.props.className}>
        <HeaderBar className="HeaderBar" />
        <SidebarMenu className="SidebarMenu" items={sidebarMenuItems} />
        <FilterBar
          className="FilterBar"
          name="year"
          options={this.getYears(tracks)}
        />
        <FilterBar
          className="FilterBar"
          name="genre"
          options={this.getGenres(tracks)}
        />
        <FilterBar
          className="FilterBar"
          name="artist"
          options={this.getArtists(tracks)}
        />
        <FilterBar
          className="FilterBar"
          name="album"
          options={this.getAlbums(tracks)}
        />
        <FilterBar
          className="FilterBar"
          name="label"
          options={this.getLabels(tracks)}
        />
        <ReleasesGrid className="ReleasesGrid" />
        <AudioPlayer className="AudioPlayer" />
      </div>
    );
  }
}

App.propTypes = {
  className: PropTypes.string
};

export default App;

/*
Put under AudioPlayer:

        <Modal className="Modal">
          Put the content here
        </Modal>

How this works: https://reactjs.org/docs/composition-vs-inheritance.html
*/
