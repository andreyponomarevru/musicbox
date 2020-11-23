import React, { Component } from "react";

import { Stats } from "./../../types";
import { Filter } from "./../Filter/Filter";
import { Error as ErrorHandler } from "./../Error/Error";

import "./Sidebar.scss";

const { REACT_APP_API_ROOT } = process.env;

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  tracksInLib: number;
}
interface SidebarState {
  isLoaded: boolean;
  error: null | Error;
  years: Stats[];
  genres: Stats[];
  artists: Stats[];
  labels: Stats[];
}

class Sidebar extends Component<SidebarProps, SidebarState> {
  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      years: [],
      genres: [],
      artists: [],
      labels: [],
    };
  }

  componentDidMount() {
    fetch(`${REACT_APP_API_ROOT}/stats/years`)
      .then((res) => res.json())
      .then(
        (res) => this.setState({ isLoaded: true, years: res.stats }),
        (error) => this.setState({ isLoaded: true, error })
      );

    fetch(`${REACT_APP_API_ROOT}/stats/genres`)
      .then((res) => res.json())
      .then(
        (res) => this.setState({ genres: res.stats }),
        (error) => this.setState({ isLoaded: true, error })
      );

    fetch(`${REACT_APP_API_ROOT}/stats/labels`)
      .then((res) => res.json())
      .then(
        (res) => this.setState({ labels: res.stats }),
        (error) => this.setState({ isLoaded: true, error })
      );

    fetch(`${REACT_APP_API_ROOT}/stats/artists`)
      .then((res) => res.json())
      .then(
        (res) => this.setState({ artists: res.stats }),
        (error) => this.setState({ isLoaded: true, error })
      );
  }

  render() {
    const { tracksInLib, className = "sidebar" } = this.props;
    const { years, genres, labels, artists, error, isLoaded } = this.state;

    if (error) {
      return <ErrorHandler errorMsg={error.message} />;
    } else if (!isLoaded) {
      return <aside className={className}>Loading...</aside>;
    } else {
      return (
        <aside className={className}>
          <Filter
            className="filter"
            name="Years"
            tracksInLib={tracksInLib}
            values={years}
          />
          <Filter
            className="filter"
            name="Genres"
            tracksInLib={tracksInLib}
            values={genres}
          />
          <Filter
            className="filter"
            name="Labels"
            tracksInLib={tracksInLib}
            values={labels}
          />
          <Filter
            className="filter"
            name="Artists"
            tracksInLib={tracksInLib}
            values={artists}
          />
        </aside>
      );
    }
  }
}

export { Sidebar };
