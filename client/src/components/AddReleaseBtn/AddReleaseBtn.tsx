import React, { Component } from "react";

import "./AddReleaseBtn.scss";

interface AddReleaseBtn extends React.HTMLAttributes<HTMLLinkElement> {
  href: string;
}

function AddReleaseBtn(props: AddReleaseBtn) {
  const { className = "add-release-btn", href = "#" } = props;

  return (
    <a href={href} className={className}>
      Add a Release
    </a>
  );
}

export { AddReleaseBtn };
