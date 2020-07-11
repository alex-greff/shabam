import React, { forwardRef } from "react";
import { BaseProps } from "@/types";
import "./BaseArc.scss";
import classnames from "classnames";

export interface Props extends BaseProps {
  stroke?: number;
  progress?: number;
  children?: React.ReactNode;
  childrenContainerClassName?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => unknown;
}

const RADIUS = 250;

const BaseArc = forwardRef<SVGSVGElement, Props>((props, ref) => {
  const { progress, stroke, onClick } = props;
  const normalizedRadius = RADIUS - stroke! / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress! / 100) * circumference;

  const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div
      className={classnames("BaseArc", props.className)}
      style={props.style}
      id={props.id}
      onClick={handleOnClick}
    >
      <svg className="BaseArc__arc" viewBox="0 0 500 500" ref={ref}>
        <circle
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset: strokeDashoffset }}
          r={normalizedRadius}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="butt"
          cx={RADIUS}
          cy={RADIUS}
        />
      </svg>
      <div
        className={classnames(
          "BaseArc__children-container",
          props.childrenContainerClassName
        )}
      >
        {props.children}
      </div>
    </div>
  );
});

BaseArc.defaultProps = {
  stroke: 0.5,
  progress: 100,
} as Partial<Props>;

export default BaseArc;
