import React from "react";

interface Props {
  value: number;
  handleChange: (value: number) => void;
  disabled?: boolean;

  className?: string;
}

export function SelectItemsPerPage(props: Props): JSX.Element {
  const { className = "", disabled = false } = props;

  return (
    <div className={`select-items-per-page ${className}`}>
      Show{" "}
      <select
        name="limit"
        className="select-items-per-page__box"
        onChange={(e) => props.handleChange(parseInt(e.target.value))}
        value={props.value}
        disabled={disabled}
      >
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="250">250</option>ronnie
      </select>
    </div>
  );
}
