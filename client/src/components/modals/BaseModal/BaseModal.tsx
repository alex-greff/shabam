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
}

const BaseModal: FunctionComponent<Props> = (props) => {
  const { open, onExited, onRequestClose, requestCloseOnOuterClick } = props;

  const onBackgroundClick = () => {
    console.log("HERE");
    if (requestCloseOnOuterClick) {
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
          <div className="BaseModal__content">{props.children}</div>
          <div
            className="BaseModal__background"
            onClick={onBackgroundClick}
          ></div>
        </div>
      </CSSTransition>
    </div>
  );
};

BaseModal.defaultProps = {
  requestCloseOnOuterClick: true,
} as Partial<Props>;

export default BaseModal;
