import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./DividerLine.scss";
import classnames from "classnames";

type Orientation = "vertical" | "horizontal";

export interface Props extends BaseProps {
  size?: string;
  orientation?: Orientation;
  contentClassName?: string;
}

const DividerLine: FunctionComponent<Props> = (props) => {
  const { orientation, size, ...rest } = props;

  const lineStyles =
    orientation === "horizontal"
      ? { width: "100%", height: size }
      : { width: size, height: "100%" };

  const hasChildren = !!props.children;

  return (
    <div
      className={classnames("DividerLine", props.className, {
        [`orientation-${orientation}`]: true,
        "has-children": hasChildren,
      })}
      style={props.style}
      id={props.id}
    >
      <div
        className="DividerLine__line DividerLine__line-left"
        style={lineStyles}
      ></div>
      <div
        className={classnames("DividerLine__content", props.contentClassName)}
      >
        {props.children}
      </div>
      <div
        className="DividerLine__line DividerLine__line-right"
        style={lineStyles}
      ></div>
    </div>
  );
};

DividerLine.defaultProps = {
  size: "1px",
  orientation: "vertical",
} as Partial<Props>;

export default DividerLine;
