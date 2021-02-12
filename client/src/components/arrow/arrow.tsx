import React from "react";

import "./arrow.scss";

interface ArrowProps extends React.HTMLAttributes<HTMLDivElement> {
  direction: string;
}

function Arrow(props: ArrowProps) {
  return <div className={`arrow arrow_${props.direction}`}></div>;
}

export { Arrow };
