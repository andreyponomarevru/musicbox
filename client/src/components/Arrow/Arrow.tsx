import React from "react";

import "./Arrow.scss";

interface ArrowProps extends React.HTMLAttributes<HTMLDivElement> {
  direction: string;
}

function Arrow(props: ArrowProps) {
  return <div className={`arrow arrow_direction_${props.direction}`}></div>;
}

export { Arrow };
