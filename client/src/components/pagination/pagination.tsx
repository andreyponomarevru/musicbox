import React, { Component, Fragment } from "react";

import { Arrow } from "../arrow/arrow";

import "./pagination.scss";

interface Props extends React.HTMLAttributes<HTMLUListElement> {
  limit: number; // items per page
  totalTracks: number;
  totalReleases: number;

  gridLayoutActive: boolean;
  listLayoutActive: boolean;

  onNextPageBtnClick: any;
  onPrevPageBtnClick: any;

  isNextBtnActive: boolean;
  isPrevBtnActive: boolean;

  from: number;
}
interface State {}

class Pagination extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handleNextPageBtnClick = this.handleNextPageBtnClick.bind(this);
    this.handlePrevPageBtnClick = this.handlePrevPageBtnClick.bind(this);
  }

  handleNextPageBtnClick() {
    this.props.onNextPageBtnClick();
  }

  handlePrevPageBtnClick() {
    this.props.onPrevPageBtnClick();
  }

  render() {
    // FIX: Maybe there is no sense in passing all these props down to this components and it's better to calculat pagination range in upper component (Content) and make This componetn 100% dumb?

    const {
      limit,
      totalTracks,
      totalReleases,
      className = "pagination",
      gridLayoutActive,
      listLayoutActive,
      from,
    } = this.props;

    let to;

    if (listLayoutActive) {
      to =
        from + (totalTracks - from >= limit ? limit - 1 : totalTracks - from);
    } else if (gridLayoutActive) {
      to =
        from +
        (totalReleases - from >= limit ? limit - 1 : totalReleases - from);
    }

    const prevBtnActive = (
      <a href="#" className="link" onClick={this.handlePrevPageBtnClick}>
        <Arrow direction="left" /> Prev
      </a>
    );
    const prevBtnInactive = (
      <Fragment>
        <Arrow direction="left" /> Prev
      </Fragment>
    );

    const nextBtnActive = (
      <a href="#" className="link" onClick={this.handleNextPageBtnClick}>
        Next <Arrow direction="right" />
      </a>
    );
    const nextBtnInactive = (
      <Fragment>
        Next <Arrow direction="right" />
      </Fragment>
    );

    // these calculation are valid only for "listLayout" !!!
    return (
      <ul className={className}>
        <li className="pagination__current-page">
          {from} - {to} of {gridLayoutActive ? totalReleases : totalTracks}
        </li>
        <li className="pagination__prev">
          {this.props.isPrevBtnActive ? prevBtnActive : prevBtnInactive}
        </li>
        <li className="pagination__next">
          {this.props.isNextBtnActive ? nextBtnActive : nextBtnInactive}
        </li>
      </ul>
    );
  }
}
export { Pagination };
