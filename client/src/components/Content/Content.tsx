import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";

import { Pagination } from "./../Pagination/Pagination";
import { SelectSort } from "./../SelectSort/SelectSort";
import { SelectItemsPerPage } from "../SelectItemsPerPage/SelectItemsPerPage";
import { GroupingBtn } from "../GroupingBtn/GroupingBtn";
import { DatabaseStats } from "./../../types";
import { ContentGrid } from "../ContentGrid/ContentGrid";
import { ContentList } from "./../ContentList/ContentList";
import { Loader } from "./../Loader/Loader";
import "./Content.scss";
import { TrackMetadata } from "./../../types";
import { ReleaseMetadata } from "./../../types";

const { REACT_APP_API_ROOT } = process.env;

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: DatabaseStats;
  filters: null | string[];
}
interface ContentState {
  tracksLoaded: boolean;
  tracksError: null | Error;
  tracks: TrackMetadata[];

  releasesLoaded: boolean;
  releasesError: null | Error;
  releases: ReleaseMetadata[];

  listLayoutActive: boolean;
  gridLayoutActive: boolean;

  sort: string;
  limit: number;

  page: number;
  isNextBtnActive: boolean;
  isPrevBtnActive: boolean;

  itemsCountFrom: number;

  [key: string]: any;
}

class Content extends Component<ContentProps, ContentState> {
  private _isMounted: boolean;

  constructor(props: ContentProps) {
    super(props);

    this._isMounted = false;

    this.state = {
      tracksLoaded: false,
      tracksError: null,
      tracks: [],

      releasesLoaded: false,
      releasesError: null,
      releases: [],

      listLayoutActive: false,
      gridLayoutActive: true,

      sort: "year,desc",
      limit: 25,

      page: 1,
      isNextBtnActive: true,
      isPrevBtnActive: false,

      itemsCountFrom: 1,
    };

    this.handleSelectSortChange = this.handleSelectSortChange.bind(this);
    this.handleSelectItemsPerPageChange = this.handleSelectItemsPerPageChange.bind(
      this
    );
    this.handleListBtnClick = this.handleListBtnClick.bind(this);
    this.handleGridBtnClick = this.handleGridBtnClick.bind(this);
    this.handleNextPageBtnClick = this.handleNextPageBtnClick.bind(this);
    this.handlePrevPageBtnClick = this.handlePrevPageBtnClick.bind(this);
  }

  handleListBtnClick() {
    // NOTE: we reset "sort" key to default value 'year,desc' to prevent API request with invalid query parameters from select box"
    this.setState(
      {
        listLayoutActive: true,
        gridLayoutActive: false,
        sort: "year,desc",
        limit: 25,
        page: 1,
        itemsCountFrom: 1,
      },
      () => {
        this.setPagingBtns();
        this.getTracks("sort", this.state.sort, "limit", this.state.limit);
      }
    );
  }

  handleGridBtnClick() {
    // NOTE: we reset "sort" key to default value 'year,desc' to prevent API request with invalid query parameters from select box"
    this.setState(
      {
        listLayoutActive: false,
        gridLayoutActive: true,
        sort: "year,desc",
        limit: 25,
        page: 1,
        itemsCountFrom: 1,
      },
      () => {
        this.setPagingBtns();
        this.getReleases("sort", this.state.sort, "limit", this.state.limit);
      }
    );
  }

  setPagingBtns() {
    this.setState((state, props) => {
      const numOfItems = state.gridLayoutActive
        ? props.stats.releases
        : props.stats.tracks;

      return {
        isNextBtnActive: numOfItems / state.limit > 1,
        isPrevBtnActive: state.page > 1,
      };
    });
  }

  handleSelectSortChange(controlName: string, value: string) {
    console.log(controlName, value);
    this.setState({ [controlName]: value }, () => {
      if (this.state.gridLayoutActive) {
        this.getReleases("sort", this.state.sort, "limit", this.state.limit);
      } else if (this.state.listLayoutActive) {
        this.getTracks("sort", this.state.sort, "limit", this.state.limit);
      }

      return { [controlName]: value };
    });
  }

  handleSelectItemsPerPageChange(controlName: string, value: number) {
    console.log(controlName, value);

    this.setState(
      (state, props) => {
        return {
          [controlName]: value,
          page: 1,
        };
      },
      () => {
        this.setState((state, props) => {
          const numOfItems = state.gridLayoutActive
            ? props.stats.releases
            : props.stats.tracks;

          return {
            isNextBtnActive: numOfItems / value > 1,
            isPrevBtnActive: state.page > 1,
          };
        });

        if (this.state.gridLayoutActive) {
          this.getReleases("sort", this.state.sort, "limit", this.state.limit);
        } else if (this.state.listLayoutActive) {
          this.getTracks("sort", this.state.sort, "limit", this.state.limit);
        }
      }
    );
  }

  getTracks(
    sortControlName: string = "sort",
    sortControlValue: string = this.state.sort,
    limitControlName: string = "limit",
    limitControlValue: number = this.state.limit
  ) {
    console.log(
      sortControlName,
      sortControlValue,
      limitControlName,
      limitControlValue
    );

    const apiUrl = `${REACT_APP_API_ROOT}/tracks?sort=${sortControlValue}&page=${this.state.page}&limit=${limitControlValue}`;

    console.log(apiUrl);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((res) => {
        if (res.hasOwnProperty("errorCode")) {
          throw new Error(`${apiUrl}: ${res.message}`);
        } else {
          return res;
        }
      })
      .then(
        (res) => {
          if (this._isMounted) {
            this.setState({
              tracks: res.tracks,
              tracksLoaded: true,
            });
          }
        },
        (tracksError) => this.setState({ tracksLoaded: false, tracksError })
      );
  }

  getReleases(
    sortControlName: string = "sort",
    sortControlValue: string = this.state.sort,
    limitControlName: string = "limit",
    limitControlValue: number = this.state.limit
  ) {
    console.log(
      sortControlName,
      sortControlValue,
      limitControlName,
      limitControlValue
    );

    /*
    const totalNumOfPages = Math.ceil(
      this.props.stats.tracks / this.state.limit
    );
    */

    const apiUrl = `${REACT_APP_API_ROOT}/releases?sort=${sortControlValue}&page=${this.state.page}&limit=${limitControlValue}`;

    console.log(apiUrl);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((res) => {
        if (res.hasOwnProperty("errorCode")) {
          throw new Error(`${apiUrl}: ${res.message}`);
        } else {
          return res;
        }
      })
      .then(
        (res) => {
          if (this._isMounted) {
            this.setState({
              releases: res.releases,
              releasesLoaded: true,
            });
          }
        },
        (releasesError) =>
          this.setState({ releasesLoaded: false, releasesError })
      );
  }

  handleNextPageBtnClick() {
    this.setState(
      (state, props) => {
        return {
          page: state.page + 1,
          itemsCountFrom: state.limit * state.page + 1,
        };
      },
      () => {
        this.setState((state, props) => {
          if (this.state.gridLayoutActive) this.getReleases();
          else if (this.state.listLayoutActive) this.getTracks();

          const numOfItems = state.gridLayoutActive
            ? props.stats.releases
            : props.stats.tracks;

          const isNextBtnActive =
            state.page < Math.ceil(numOfItems / state.limit);
          const isPrevBtnActive = state.page > 1;

          return { isNextBtnActive, isPrevBtnActive };
        });
      }
    );
  }

  handlePrevPageBtnClick() {
    this.setState(
      (state, props) => {
        return {
          page: state.page - 1,
          itemsCountFrom: state.itemsCountFrom - state.limit,
        };
      },
      () => {
        this.setState((state, props) => {
          if (this.state.gridLayoutActive) this.getReleases();
          else if (this.state.listLayoutActive) this.getTracks();

          const numOfItems = state.gridLayoutActive
            ? props.stats.releases
            : props.stats.tracks;

          const isNextBtnActive =
            state.page < Math.ceil(numOfItems / state.limit);
          const isPrevBtnActive = state.page > 1;

          return {
            isNextBtnActive,
            isPrevBtnActive,
          };
        });
      }
    );
  }

  componentDidMount() {
    this._isMounted = true;
    this.getReleases();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { className = "content" } = this.props;
    const {
      listLayoutActive,
      gridLayoutActive,
      tracksLoaded,
      releasesLoaded,
      tracksError,
      releasesError,
    } = this.state;

    if (
      (gridLayoutActive && !releasesLoaded) ||
      (listLayoutActive && !tracksLoaded)
    ) {
      return (
        <main className={className}>
          <Loader className="loader loader_blink" />
        </main>
      );
    }

    if (tracksError) throw new Error(tracksError.message);
    else if (releasesError) throw new Error(releasesError.message);

    let Content;
    if (listLayoutActive) {
      Content = <ContentList tracks={this.state.tracks} />;
    } else if (gridLayoutActive) {
      Content = <ContentGrid releases={this.state.releases} />;
    }

    // TODO: if gridBtn alread clicked, disable the posibillity to click it again; same for listLayoutBtn

    return (
      <main className={className}>
        <nav className="content__nav contetnt__nav_top">
          <Pagination
            limit={this.state.limit}
            totalTracks={this.props.stats.tracks}
            totalReleases={this.props.stats.releases}
            gridLayoutActive={this.state.gridLayoutActive}
            listLayoutActive={this.state.listLayoutActive}
            onNextPageBtnClick={this.handleNextPageBtnClick}
            onPrevPageBtnClick={this.handlePrevPageBtnClick}
            isNextBtnActive={this.state.isNextBtnActive}
            isPrevBtnActive={this.state.isPrevBtnActive}
            from={this.state.itemsCountFrom}
          />
          <div className="content__controls content__controls_top">
            <SelectSort
              value={this.state.sort}
              onSelectSortChange={this.handleSelectSortChange}
              gridLayoutActive={this.state.gridLayoutActive}
              listLayoutActive={this.state.listLayoutActive}
            />
            <SelectItemsPerPage
              value={this.state.limit}
              onSelectItemsPerPageChange={this.handleSelectItemsPerPageChange}
            />
            <div className="content__select-layout">
              <GroupingBtn
                onBtnClick={this.handleListBtnClick}
                active={this.state.listLayoutActive}
                iconName="list"
              />
              <GroupingBtn
                onBtnClick={this.handleGridBtnClick}
                active={this.state.gridLayoutActive}
                iconName="grid"
              />
            </div>
          </div>
        </nav>
        {Content}
        <nav className="content__nav content__content_bottom">
          <Pagination
            limit={this.state.limit}
            totalTracks={this.props.stats.tracks}
            totalReleases={this.props.stats.releases}
            gridLayoutActive={this.state.gridLayoutActive}
            listLayoutActive={this.state.listLayoutActive}
            onNextPageBtnClick={this.handleNextPageBtnClick}
            onPrevPageBtnClick={this.handlePrevPageBtnClick}
            isNextBtnActive={this.state.isNextBtnActive}
            isPrevBtnActive={this.state.isPrevBtnActive}
            from={this.state.itemsCountFrom}
          />
          <div className="content__controls content__controls_bottom">
            <SelectItemsPerPage
              value={this.state.limit}
              onSelectItemsPerPageChange={this.handleSelectItemsPerPageChange}
            />
          </div>
        </nav>
      </main>
    );
  }
}

export { Content };
