import React, { Component, useImperativeHandle } from "react";

import "./Navigation.scss";

interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {}
interface NavigationState {}

class Navigation extends Component<NavigationProps, NavigationState> {
  render() {
    return (
      <nav className={this.props.className}>
        <ul className="pagination">
          <li className="pagination__prev">Prev</li>
          <li className="pagination_next">Next</li>
        </ul>
        <div className="sorting">
          Sort{" "}
          <select>
            <option>Artist, A-Z</option>
            <option>Artist, Z-A</option>
            <option>Release Title, A-Z</option>
            <option>Release Title, Z-A</option>
            <option>Year, 0-9</option>
            <option>Year, 9-0</option>
          </select>
        </div>
        <div className="grouping">
          Group{" "}
          <select>
            <option>Releases</option>
            <option>Tracks</option>
          </select>
        </div>
        <div className="show">
          <select>
            <option>25</option>
            <option>50</option>
            <option>100</option>
            <option>250</option>
            <option>500</option>
          </select>
        </div>
        <div className="view-mode">
          <span>Grid</span>
          <span>Rows</span>
        </div>
      </nav>
    );
  }
}

export { Navigation };
