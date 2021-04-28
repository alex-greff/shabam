import React, { VoidFunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./MessageConfirmationTemplate.scss";
import classnames from "classnames";

export interface Props extends BaseProps {
  title: string;
  message: string;
}

const MessageConfirmationTemplate: VoidFunctionComponent<Props> = (props) => {
  const { className, style, id, title, message } = props;
  return (
    <div
      className={classnames("MessageConfirmationTemplate", className)}
      style={style}
      id={id}
    >
      <div className="MessageConfirmationTemplate__title">{title}</div>
      <div className="MessageConfirmationTemplate__message">{message}</div>
    </div>
  );
};

MessageConfirmationTemplate.defaultProps = {} as Partial<Props>;

export default MessageConfirmationTemplate;
