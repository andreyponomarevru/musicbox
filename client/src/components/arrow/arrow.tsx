import React from "react";

import "./arrow.scss";

type Props = React.HTMLAttributes<HTMLDivElement>;

function Arrow(props: Props): JSX.Element {
  const { className = "" } = props;

  return <div className={`arrow ${className}`}></div>;
}

export { Arrow };
