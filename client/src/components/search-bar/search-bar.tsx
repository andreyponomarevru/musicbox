import React from "react";

import "./search-bar.scss";

interface Props {
  className: string;
  onSearchChange: (input: string) => void;
}

export function SearchBar(props: Props): JSX.Element {
  const { className = "" } = props;

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    props.onSearchChange(e.currentTarget.value);
  }

  return (
    <div className={`search-bar ${className}`}>
      <label className="search-bar__label" htmlFor="name">
        <input
          className="search-bar__input"
          type="text"
          id="name"
          name="name"
          placeholder="Search by artist name, track title or release title"
          onChange={onChange}
        />
      </label>
    </div>
  );
}
