import React from "react";

import "./arrow.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  direction: string;
}

function Arrow(props: Props) {
  return <div className={`arrow arrow_${props.direction}`}></div>;
}

export { Arrow };
