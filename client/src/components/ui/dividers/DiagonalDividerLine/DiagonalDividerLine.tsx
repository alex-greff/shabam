import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./DiagonalDividerLine.scss";
import classnames from "classnames";

export interface Props extends BaseProps {
  containerWidth?: string;
  lineSize?: string;
  rotation?: string;
  style?: Omit<React.CSSProperties, "width">;
};

const DiagonalDividerLine: FunctionComponent<Props> = (props) => {
  const { containerWidth, lineSize, rotation } = props;

  return (
    <div 
      className={classnames("DiagonalDividerLine", props.className)}
      style={{width: containerWidth, ...props.style}}
      id={props.id}
    >
      <div
        className="DiagonalDividerLine__line"
        style={{
          height: "100%",
          width: lineSize,
          transform: `rotateZ(${rotation})`
        }}
      ></div>
    </div>
  );
};

DiagonalDividerLine.defaultProps = {
  direction: "right",
  containerWidth: "2rem",
  lineSize: "1px",
  rotation: "10deg"
} as Partial<Props>;

export default DiagonalDividerLine;