import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./BaseModal.scss";
import classnames from "classnames";
import { CSSTransition } from "react-transition-group";

export interface Props extends BaseProps {
  open: boolean;
  onExited: () => unknown;
  onRequestClose: () => unknown;
  requestCloseOnOuterClick?: boolean;
  maxWidth?: string;
  disabled?: boolean;
}

const BaseModal: FunctionComponent<Props> = (props) => {
  const {
    open,
    onExited,
    onRequestClose,
    requestCloseOnOuterClick,
    maxWidth,
    disabled
  } = props;

  const onBackgroundClick = () => {
    if (requestCloseOnOuterClick && !disabled) {
      onRequestClose();
    }
  };

  return (
    <div
      className={classnames("BaseModal", props.className)}
      style={props.style}
      id={props.id}
    >
      <CSSTransition
        in={open}
        classNames="base-modal-animation"
        timeout={200}
        onExited={onExited}
      >
        <div className="BaseModal__container">
          <div className="BaseModal__content-container">
            <div className="BaseModal__content" style={{ maxWidth: maxWidth }}>
              {props.children}
            </div>
          </div>
          <div
            className="BaseModal__overlay-background"
            onClick={onBackgroundClick}
          ></div>
        </div>
      </CSSTransition>
    </div>
  );
};

BaseModal.defaultProps = {
  requestCloseOnOuterClick: true,
  maxWidth: "50rem",
  disabled: false,
} as Partial<Props>;

export default BaseModal;
