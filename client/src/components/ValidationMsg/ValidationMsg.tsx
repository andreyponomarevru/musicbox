import React from "react";

import "./ValidationMsg.scss";

interface ValidationMsgProps extends React.HTMLAttributes<HTMLSpanElement> {
  inputVal: unknown;
  errorMsg: string;
  successMsg: string;
}
export function ValidationMsg(props: ValidationMsgProps) {
  const { inputVal, errorMsg, successMsg } = props;

  if (inputVal === null) {
    return <small className="validation-msg validation-msg_empty"></small>;
  } else if (inputVal === "" || errorMsg.length > 0) {
    return (
      <small className="validation-msg validation-msg_warning">
        {errorMsg}
      </small>
    );
  } else {
    return (
      <small className="validation-msg validation-msg_success">
        {successMsg}
      </small>
    );
  }
}
