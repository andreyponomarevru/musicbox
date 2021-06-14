import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  handleChange: (value: number) => void;
}

export function SelectItemsPerPage(props: Props) {
  const { className = "" } = props;

  return (
    <div className={`select-items-per-page ${className}`}>
      Show{" "}
      <select
        name="limit"
        className="select-items-per-page__box"
        onChange={(e) => props.handleChange(parseInt(e.target.value))}
        value={props.value}
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
