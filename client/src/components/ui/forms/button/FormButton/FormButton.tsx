import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./FormButton.scss";
import classnames from "classnames";

export type Style = "primary" | "secondary";

export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  colorStyle?: Style;
}

const FormButton: FunctionComponent<Props> = (props) => {
  const { colorStyle, ...rest } = props;

  const isSecondary = colorStyle === "secondary";

  return (
    <button
      {...rest}
      className={classnames("FormButton", props.className, {
        secondary: isSecondary,
      })}
    >
      {props.children}
    </button>
  );
};

FormButton.defaultProps = {
  colorStyle: "primary",
} as Partial<Props>;

export default FormButton;
