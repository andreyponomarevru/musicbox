import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";

import { Pagination } from "../pagination/pagination";
import { SelectSort } from "../select-sort/select-sort";
import { SelectItemsPerPage } from "../select-items-per-page/select-items-per-page";
import { GroupingBtn } from "../grouping-btn/grouping-btn";
import { DatabaseStats } from "../../types";
import { ContentGrid } from "../content-grid/content-grid";
import { ContentList } from "../content-list/content-list";
import { Loader } from "../loader/loader";
import { TrackMetadata } from "../../types";
import { ReleaseMetadata } from "../../types";

import "./content.scss";

const { REACT_APP_API_ROOT } = process.env;

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: DatabaseStats;
  filters: null | string[];
  handleDeleteReleaseBtnClick: (releaseId: number) => void;
  handleUpdateReleases: () => void;
  releaseDeleted: boolean;
  handleGetStats: () => void;
}
interface ContentState {
  tracksLoaded: boolean;
  tracksError: null | Error | string;
  tracks: TrackMetadata[];

  releasesLoaded: boolean;
  releasesError: null | Error | string;
  releaseDeleted: boolean;
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

      releaseDeleted: false,
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
        this.getTracks(this.state.sort, this.state.limit);
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
        this.getReleases(this.state.sort, this.state.limit);
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
    this.setState({ [controlName]: value }, () => {
      if (this.state.gridLayoutActive) {
        this.getReleases(this.state.sort, this.state.limit);
      } else if (this.state.listLayoutActive) {
        this.getTracks(this.state.sort, this.state.limit);
      }

      return { [controlName]: value };
    });
  }

  handleSelectItemsPerPageChange(controlName: string, value: number) {
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
          this.getReleases(this.state.sort, this.state.limit);
        } else if (this.state.listLayoutActive) {
          this.getTracks(this.state.sort, this.state.limit);
        }
      }
    );
  }

  getTracks(
    sortControlValue: string = this.state.sort,
    limitControlValue: number = this.state.limit
  ) {
    console.log(sortControlValue, limitControlValue);

    const apiUrl = `${REACT_APP_API_ROOT}/tracks?sort=${sortControlValue}&page=${this.state.page}&limit=${limitControlValue}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((res) => {
        if (res.hasOwnProperty("errorCode")) {
          const err = `${apiUrl}: ${res.message}`;
          () => this.setState({ tracksLoaded: false, tracksError: err });
          throw new Error(err);
        } else {
          return res;
        }
      })
      .then(
        (res) => {
          if (this._isMounted) {
            console.log(res, res.next_page);
            this.setState((state, props) => {
              const isNextBtnActive = !!res.next_page;

              const newState = {
                tracks: res.results,
                tracksLoaded: true,
                isNextBtnActive,
              };
              return newState;
            });
          }
        },
        (tracksError) => this.setState({ tracksLoaded: false, tracksError })
      );
  }

  getReleases(
    sortControlValue: string = this.state.sort,
    limitControlValue: number = this.state.limit
  ) {
    const apiUrl = `${REACT_APP_API_ROOT}/releases?sort=${sortControlValue}&page=${this.state.page}&limit=${limitControlValue}`;

    console.log(apiUrl);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((res) => {
        if (res.hasOwnProperty("errorCode")) {
          const err = `${apiUrl}: ${res.message}`;
          this.setState({ releasesLoaded: false, releasesError: err });
          throw new Error();
        } else {
          return res;
        }
      })
      .then(
        (res) => {
          if (this._isMounted) {
            console.log(res);
            this.setState((state, props) => {
              const isNextBtnActive = !!res.next_page;

              const newState = {
                releases: res.results,
                releasesLoaded: true,
                isNextBtnActive,
              };
              return newState;
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

  componentDidUpdate() {
    if (this.props.releaseDeleted) {
      this.getReleases();
      this.props.handleUpdateReleases();
    }
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

    if (tracksError) {
      //<main className={className}>No Tracks</main>;
      throw tracksError;
    } else if (releasesError) {
      //<main className={className}>No Releases</main>;
      throw releasesError;
    } else if (
      (gridLayoutActive && !releasesLoaded) ||
      (listLayoutActive && !tracksLoaded)
    ) {
      return (
        <main className={className}>
          <Loader className="loader loader_blink" />
        </main>
      );
    }

    let Content;
    if (listLayoutActive) {
      Content = <ContentList tracks={this.state.tracks} />;
    } else if (gridLayoutActive) {
      Content = (
        <ContentGrid
          handleDeleteReleaseBtnClick={this.props.handleDeleteReleaseBtnClick}
          releases={this.state.releases}
        />
      );
    }

    // TODO: if gridLayoutBtn alread clicked, disable the posibillity to click it again; same for listLayoutBtn

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
