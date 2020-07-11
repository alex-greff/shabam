import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./HamburgerMenu.scss";
import classnames from "classnames";

export interface Props extends BaseProps {
  open?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => unknown;
  size?: string;
  barThickness?: string;
  style?: Omit<React.CSSProperties, "height" | "width">;
}

const HEIGHT_TO_WIDTH_RATIO = 0.6;

const HamburgerMenu: FunctionComponent<Props> = (props) => {
  const { open, disabled, onClick, size, barThickness } = props;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) {
      e.stopPropagation();
      return;
    }

    if (onClick) {
      onClick(e);
    }
  };

  const barStyles = {
    height: `${barThickness}`,
  };

  return (
    <div
      className={classnames("HamburgerMenu", props.className, {
        open,
        disabled,
      })}
      onClick={handleClick}
      style={{
        ...props.style,
        height: `calc(${size}*${HEIGHT_TO_WIDTH_RATIO})`,
        width: size,
      }}
      id={props.id}
    >
      <span
        className="HamburgerMenu__bar HamburgerMenu__top-bar"
        style={barStyles}
      />
      <span
        className="HamburgerMenu__bar HamburgerMenu__mid-bar-1"
        style={barStyles}
      />
      <span
        className="HamburgerMenu__bar HamburgerMenu__mid-bar-2"
        style={barStyles}
      />
      <span
        className="HamburgerMenu__bar HamburgerMenu__bottom-bar"
        style={barStyles}
      />
    </div>
  );
};

HamburgerMenu.defaultProps = {
  open: false,
  disabled: false,
  size: "2.3rem",
  barThickness: "15%",
} as Partial<Props>;

export default HamburgerMenu;
