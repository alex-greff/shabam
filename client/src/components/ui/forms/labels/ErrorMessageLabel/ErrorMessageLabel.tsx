import React, { VoidFunctionComponent } from "react";
import "./ErrorMessageLabel.scss";
import classnames from "classnames";
import { FieldError } from "react-hook-form";

export interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  error?: FieldError;
}

const ErrorMessageLabel: VoidFunctionComponent<Props> = (props) => {
  const { error, ...rest } = props;

  const hasErrorMessage = !!error?.message;

  return (
    <label
      {...rest}
      className={classnames("ErrorMessageLabel", props.className, {
        hidden: !hasErrorMessage,
      })}
      style={props.style}
      id={props.id}
    >
      {error ? error.message : "\u00a0"}
    </label>
  );
};

ErrorMessageLabel.defaultProps = {} as Partial<Props>;

export default ErrorMessageLabel;
