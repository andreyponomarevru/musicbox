import React, { useState, useEffect } from "react";

import "./search-bar.scss";

interface Props {
  className: string;
}

export function SearchBar(props: Props) {
  const { className } = props;

  return (
    <div className={`search-bar ${className}`}>
      <label className="search-bar__label" htmlFor="name" />
      <div className="search-bar__container">
        <input
          className="search-bar__input"
          type="text"
          id="name"
          name="name"
          placeholder="Search albums, artists and more"
        />
      </div>
    </div>
  );
}
