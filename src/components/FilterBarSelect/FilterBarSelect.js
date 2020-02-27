import React, { Component } from "react";
import PropTypes from "prop-types";
import "./FilterBarSelect.scss";

class FilterBarSelect extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    // Get all available options from DB
    const filterName = this.props.name;

    console.log(this.getGenres());

    switch (filterName) {
      case "year":
        this.options = this.getYears();
        break;
      case "genre":
        this.options = this.getGenres();
        break;
      case "artist":
        this.options = this.getArtists();
        break;
      case "album":
        this.options = this.getAlbums();
        break;
      case "label":
        this.options = this.getLabels();
        break;
    }

    //this.state = { [this.props.name]: [this.options[this.options.length - 1]] };
    this.state = {};
  }

  getYears() {
    const DB = [];
    for (let year = 1969; year < 2020; year++) DB.push(year);
    return DB;
  }

  getGenres() {
    const DB = [
      "Ambient",
      "Downtempo",
      "House",
      "Soul, Funk, Jazz",
      "Pop",
      "R&B, Hip-Hop",
      "Breakbeat, Jungle, Drum n Bass",
      "Disco"
    ];
    return DB;
  }

  getArtists() {
    const DB = [
      "Blue 6",
      "Pete Namlook",
      "Soulsearcher",
      "The Future Sounds Of London",
      "Chaka Khan",
      "Spacetime Continuum",
      "Rene & Angela",
      "Aqua Basinno",
      "Shmoov!",
      "Firefly"
    ];

    return DB;
  }

  getAlbums() {
    const DB = [
      "Tropicalla",
      "Love Will Find it's way",
      "Loves All Right",
      "Monster Munch EP",
      "Various - Bargrooves 2018",
      "Modern Architect",
      "Welcome to Earth",
      "Blow",
      "Circles",
      "One night in Grodno"
    ];

    return DB;
  }

  getLabels() {
    const DB = [
      "Hed Kandi Records",
      "Ministry of Sound",
      "Naked Music Recordings",
      "Guidance Recordings",
      "Emit",
      "Dekmantel",
      "Motown",
      "Freerange",
      "Glasgow Underground"
    ];

    return DB;
  }

  handleChange(e) {
    const selectedOptions = this.state[this.props.name] ? this.state[this.props.name] : '';
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

    // TODO:
    // replace switch statement with
    // this.props.name === 'year' ? className={`${this.props.className} ${this.props.className} : className={`${this.props.className}`}
    switch (this.props.name) {
      case "year":
        return (
          <select
            value={this.state[this.props.name]}
            multiple={true}
            className={`${this.props.className} ${this.props.className}_type_year`}
            onChange={this.handleChange}
            name={this.props.name}
          >
            {options}
          </select>
        );

      default:
        return (
          <select
            value={this.state[this.props.name]}
            multiple={true}
            className={`${this.props.className}`}
            onChange={this.handleChange}
            name={this.props.name}
          >
            {options}
          </select>
        );
    }
  }

  static propTypes = {
    name: PropTypes.string,
    className: PropTypes.string
  };
}

export default FilterBarSelect;
