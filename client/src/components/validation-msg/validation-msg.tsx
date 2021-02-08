import React from "react";

import "./validation-msg.scss";

interface ValidationMsgProps extends React.HTMLAttributes<HTMLSpanElement> {
  inputVal: unknown;
  errorMsg?: string;
  successMsg?: string;
}
export function ValidationMsg(props: ValidationMsgProps) {
  const {
    inputVal,
    errorMsg = "Invalid value",
    successMsg = "OK",
    className = "validation-msg",
  } = props;

  if (inputVal === null) {
    return <small className={`${className} validation-msg_empty`}></small>;
  } else if (inputVal === "" || errorMsg.length > 0) {
    return (
      <small className={`${className} validation-msg_warning`}>
        {errorMsg}
      </small>
    );
  } else {
    return (
      <small className={`${className} validation-msg_success`}>
        {successMsg}
      </small>
    );
  }
}
