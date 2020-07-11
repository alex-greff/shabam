import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./CircularButton.scss";
import classnames from "classnames";

import BaseArc from "@/components/ui/arcs/BaseArc/BaseArc";

export interface Props extends BaseProps {
  disabled?: boolean;
  size?: string;
  style?: Omit<React.CSSProperties, "width" | "height">;
  stroke?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => unknown;
}

const CircularButton: FunctionComponent<Props> = (props) => {
  const { disabled, size, onClick } = props;

  const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <BaseArc
      className={classnames("CircularButton", props.className, { disabled })}
      childrenContainerClassName="CircularButton__center-container"
      style={{
        ...props.style,
        width: size,
        height: size,
      }}
      id={props.id}
      progress={100}
      stroke={props.stroke}
      onClick={handleOnClick}
    >
      {props.children}
    </BaseArc>
  );
};

CircularButton.defaultProps = {
  disabled: false,
  size: "4rem",
  stroke: 30,
} as Partial<Props>;

export default CircularButton;
