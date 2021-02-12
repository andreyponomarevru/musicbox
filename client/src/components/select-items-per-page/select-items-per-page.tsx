import React, { Component } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  onSelectItemsPerPageChange: (controlName: string, value: number) => void;
}
interface State {}

class SelectItemsPerPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.props.onSelectItemsPerPageChange(
      e.target.name,
      parseInt(e.target.value)
    );
  }

  render() {
    const { className = "select-items-per-page" } = this.props;

    return (
      <div className={className}>
        Show{" "}
        <select
          name="limit"
          className="select-items-per-page__box"
          onChange={this.handleChange}
          value={this.props.value}
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="250">250</option>
          <option value="500">500</option>
        </select>
      </div>
    );
  }
}

export { SelectItemsPerPage };
