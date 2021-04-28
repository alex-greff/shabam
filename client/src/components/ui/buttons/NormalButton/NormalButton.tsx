import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./NormalButton.scss";
import classnames from "classnames";

import ButtonBase, {
  Props as ButtonBaseProps,
} from "@/components/ui/buttons/ButtonBase/ButtonBase";

export type Appearance = "outlined" | "solid" | "none";
export type TextColor = "primary" | "secondary";
export type Mode = "info" | "error" | "success" | "warning" | "blue" | "grey";

export interface Props extends BaseProps, ButtonBaseProps {
  outlined?: boolean;
  appearance?: Appearance;
  textColor?: TextColor;
  mode?: Mode;
  disabled?: boolean;
  selected?: boolean;
}

const NormalButton: FunctionComponent<Props> = (props) => {
  const {
    appearance,
    outlined,
    className,
    style,
    textColor,
    mode,
    disabled,
    selected,
    ...rest
  } = props;

  return (
    <ButtonBase
      {...rest}
      className={classnames("NormalButton", className, {
        disabled,
        selected,
        [`appearance-${appearance}`]: true,
        [`text-color-${textColor}`]: true,
        [`mode-${mode}`]: true,
      })}
      style={style}
    >
      {props.children}
    </ButtonBase>
  );
};

NormalButton.defaultProps = {
  outlined: false,
  appearance: "none",
  textColor: "primary",
  mode: "info",
  disabled: false,
  selected: false
} as Partial<Props>;

export default NormalButton;
