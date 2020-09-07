import React, { FunctionComponent, useState, useRef } from "react";
import "./NumberInput.scss";
import classnames from "classnames";
import * as Utilities from "@/utilities";
import AddIcon from "@material-ui/icons/Add";
import MinusIcon from "@material-ui/icons/Remove";

export interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

const NumberInput: FunctionComponent<Props> = (props) => {
  const { style, id, className, disabled, ...rest } = props;
  const [genId] = useState(Utilities.generateId());
  const inputRef = useRef<HTMLInputElement>(null);
  const [focussed, setFocus] = useState<boolean>(false);

  const onFocusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocus(true);

    if (props.onFocus) props.onFocus(e);
  };

  const onBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocus(false);

    if (props.onBlur) props.onBlur(e);
  };

  const updateInputValue = (stepUp: boolean) => {
    const inputEl = inputRef.current;
    if (inputEl) {
      const step = inputEl.step !== "" ? parseInt(inputEl.step) : 1;
      const direction = stepUp ? 1 : -1;
      const value = inputEl.value !== "" ? parseInt(inputEl.value) : 0;

      const event = new Event("input", { bubbles: true });
      inputEl.value = (value + step * direction).toString();
      inputEl.dispatchEvent(event);
    }
  };

  const onIncrHandler = () => {
    if (disabled) return;
    updateInputValue(true);
  };

  const onDecrHandler = () => {
    if (disabled) return;
    updateInputValue(false);
  };

  return (
    <div
      className={classnames("NumberInput", className, { focussed, disabled })}
      style={style}
      id={id}
    >
      <label
        htmlFor={genId}
        className="NumberInput__control"
        onClick={onDecrHandler}
      >
        <MinusIcon />
      </label>

      <input
        ref={inputRef}
        {...rest}
        className="NumberInput__input"
        type="number"
        id={genId}
        disabled={disabled}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
      />

      <label
        htmlFor={genId}
        className="NumberInput__control"
        onClick={onIncrHandler}
      >
        <AddIcon />
      </label>
    </div>
  );
};

NumberInput.defaultProps = {} as Partial<Props>;

export default NumberInput;
