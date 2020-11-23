import React, { Component, useImperativeHandle } from "react";

import "./CallToAction.scss";

interface CallToActionProps extends React.HTMLAttributes<HTMLHeadingElement> {}

function CallToAction(props: CallToActionProps) {
  const { className = "call-to-action" } = props;

  return <h1 className={className}>Find music in your music box</h1>;
}

export { CallToAction };
