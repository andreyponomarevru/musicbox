import React, { Component } from "react";
import PropTypes from "prop-types";
import "./FilterBarSelect.scss";

class FilterBarSelect extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    // Get all available options from DB
    const filterName = this.props.name;

    switch (filterName) {
      case "year":
        this.options = this.getYears(this.props.tracks);
        break;
      case "genre":
        this.options = this.getGenres(this.props.tracks);
        break;
      case "artist":
        this.options = this.getArtists(this.props.tracks);
        break;
      case "album":
        this.options = this.getAlbums(this.props.tracks);
        break;
      case "label":
        this.options = this.getLabels(this.props.tracks);
        break;
    }

    //this.state = { [this.props.name]: [this.options[this.options.length - 1]] };
    console.log(this.state);
  }

  sortToMinNum() {}

  sortToMaxNum() {}

  sortToA() {}

  sortToZ() {}

  sortNumValues(arr) {
    arr.sort();
  }

  sortStrValues(arr) {
    arr.sort();
  }

  getYears(database) {
    const years = [];
    database.forEach(track => {
      const year = parseFloat(track.year);
      if (!years.includes(year)) years.push(year);
    });

    years.sort();
    console.log(years);

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
    console.log(genres);
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
    console.log(artists);
    return artists;
  }

  getAlbums(database) {
    const albums = [];
    database.forEach(track => {
      const album = track.album;
      if (!albums.includes(album)) albums.push(album);
    });
    console.log(albums);
    return albums;
  }

  getLabels(database) {
    const labels = [];
    database.forEach(track => {
      const label = track.label;
      if (!labels.includes(label)) labels.push(label);
    });
    console.log(labels);
    return labels;
  }

  handleChange(e) {
    const selectedOptions = this.state[this.props.name]
      ? this.state[this.props.name]
      : "";
    const isSelected = selectedOptions.includes(e.target.value);

    // Handle all selected/deselected options through this.state.values
    if (isSelected && selectedOptions.length >= 1) {
      const uncheckedIndex = selectedOptions.indexOf(e.target.value);

      const newState = {
        [this.props.name]: selectedOptions.filter(
          (_, i) => i !== uncheckedIndex
        )
      };
      this.setState(newState, () => console.log(this.state));
    } else {
      const newState = {
        [this.props.name]: [...selectedOptions, e.target.value]
      };
      this.setState(newState, () => console.log(this.state));
    }
  }

  render() {
    const options = this.options.map(name => (
      <option
        value={name}
        key={name}
        className={`${this.props.className}__option`}
      >
        {name}
      </option>
    ));

    return (
      <select
        value={this.state[this.props.name]}
        multiple={true}
        className={
          this.props.name === "year"
            ? `${this.props.className} ${this.props.className}_type_year`
            : `${this.props.className}`
        }
        onChange={this.handleChange}
        name={this.props.name}
      >
        {options}
      </select>
    );
  }

  static propTypes = {
    tracks: PropTypes.array,
    name: PropTypes.string,
    className: PropTypes.string
  };
}

export default FilterBarSelect;
