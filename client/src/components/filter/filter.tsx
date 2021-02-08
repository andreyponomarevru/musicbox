import React, { Component } from "react";

import "./filter.scss";

import { Arrow } from "../arrow/arrow";
import { Stats } from "../../types";
import { FilterRowCounter } from "../filter-row-counter/filter-row-counter";
import { Modal } from "../modal/modal";

interface FilterProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  values: Stats[];
  tracksInLib: number;
}
interface FilterState {
  showModal: boolean;
}

class Filter extends Component<FilterProps, FilterState> {
  constructor(props: FilterProps) {
    super(props);
    this.state = { showModal: false };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal() {
    document.body.style.overflow = "hidden";
    this.setState({ showModal: true });
  }

  hideModal() {
    document.body.style.overflow = "unset";
    this.setState({ showModal: false });
  }

  render() {
    const count = this.props.values.length;

    const rows = this.props.values.map((stats) => {
      return (
        <li className="filter__row-wrapper" key={stats.id}>
          {/*<a href="#" className="filter__row">*/}
          <span className="filter__row">
            <span className="filter__name">{stats.name}</span>
            <FilterRowCounter
              count={stats.tracks}
              tracksInLib={this.props.tracksInLib}
            />
          </span>

          {/*</a>*/}
        </li>
      );
    });

    return (
      <div className="filter">
        <h1 className="filter__heading">
          {this.props.name} ({count})
        </h1>
        <ul className="filter__content">{...rows.slice(0, 5)}</ul>
        <a href="#" className="filter__more-row" onClick={this.showModal}>
          <span className="filter__more-text">All</span>{" "}
          <div className="filter__arrow">
            <Arrow className="filter__arrow" direction="down" />
          </div>
        </a>

        <Modal
          name={this.props.name}
          show={this.state.showModal}
          handleClose={this.hideModal}
          content={rows}
        />
      </div>
    );
  }
}

export { Filter };
