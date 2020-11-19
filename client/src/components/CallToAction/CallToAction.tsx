import React, { Component, useImperativeHandle } from "react";

import "./CallToAction.scss";

interface CallToActionProps extends React.HTMLAttributes<HTMLHeadingElement> {}

function CallToAction(props: CallToActionProps) {
  return <h1 className={props.className}>Find music in your music box</h1>;
}

export { CallToAction };
