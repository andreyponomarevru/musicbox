import React, { Component, Fragment } from "react";

interface SelectSortProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onSelectSortChange: (controlName: string, value: string) => void;

  gridLayoutActive: boolean;
  listLayoutActive: boolean;
}
interface SelectSortState {}

class SelectSort extends Component<SelectSortProps, SelectSortState> {
  constructor(props: SelectSortProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.props.onSelectSortChange(e.target.name, e.target.value);
  }

  render() {
    const { className = "select-sort" } = this.props;

    return (
      <div className={className}>
        Sort{" "}
        <select
          name="sort"
          className="select-sort__box"
          onChange={this.handleChange}
          value={this.props.value}
        >
          {this.props.gridLayoutActive ? (
            <Fragment>
              <option value="artist,asc">Artist, A-Z</option>
              <option value="artist,desc">Artist, Z-A</option>
              <option value="title,asc">Title, A-Z</option>
              <option value="title,desc">Title, Z-A</option>
              <option value="year,asc">Year, 0-9</option>
              <option value="year,desc">Year, 9-0</option>
            </Fragment>
          ) : (
            <Fragment>
              <option value="release-artist,asc">Artist, A-Z</option>
              <option value="release-artist,desc">Artist, Z-A</option>
              <option value="release-title,asc">Release Title, A-Z</option>
              <option value="release-title,desc">Release Title, Z-A</option>
              <option value="year,asc">Year, 0-9</option>
              <option value="year,desc">Year, 9-0</option>
            </Fragment>
          )}
        </select>
      </div>
    );
  }
}

export { SelectSort };
