import React, { Component } from "react";

import "./AddReleaseBtn.scss";

interface AddReleaseBtn extends React.HTMLAttributes<HTMLLinkElement> {}

function AddReleaseBtn(props: AddReleaseBtn) {
  return (
    <a href="/release/add" className={props.className}>
      Add a Release
    </a>
  );
}

export { AddReleaseBtn };
