import React from "react";

import "./loader.scss";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

function Loader(props: LoaderProps) {
  const { className = "loader" } = props;

  return <div className={className}>Loading...</div>;
}

export { Loader };
