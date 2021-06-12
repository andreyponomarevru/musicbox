import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./modal.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  header: string | number;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal(props: Props) {
  const { onClose, children, isOpen, header, className = "" } = props;

  if (isOpen) document.body.style.overflow = "hidden";
  else document.body.style.overflow = "unset";

  return isOpen
    ? ReactDOM.createPortal(
        <div className={`${isOpen ? "modal modal_active" : "modal"}`}>
          <section className={`${className} modal__container`}>
            <header className="modal__header">
              <h1>{header}</h1>
              <span className="modal__close-btn" onClick={onClose}>
                <svg className="modal__close-icon" viewBox="0 0 40 40">
                  <path d="M 10,10 L 30,30 M 30,10 L 10,30"></path>
                </svg>
              </span>
            </header>
            <main className="modal__content">{children}</main>
          </section>
        </div>,
        document.body
      )
    : null;
}
