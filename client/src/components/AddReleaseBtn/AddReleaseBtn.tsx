import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./AddReleaseBtn.scss";

interface AddReleaseBtn extends React.HTMLAttributes<HTMLLinkElement> {}

function AddReleaseBtn(props: AddReleaseBtn) {
  const { className = "add-release-btn" } = props;

  return (
    <NavLink to="/release/add" className={className}>
      Add a Release
    </NavLink>
  );
}

export { AddReleaseBtn };
