import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./Chip.scss";
import classnames from "classnames";

import IconButton from "@/components/ui/buttons/IconButton/IconButton";

import RemoveIcon from "@material-ui/icons/Close";

export interface Props extends BaseProps {
  removable?: boolean;
  onRemove?: () => unknown;
  disabled?: boolean;
}

const Chip: FunctionComponent<Props> = (props) => {
  const { removable, onRemove, disabled } = props;

  return (
    <div
      className={classnames("Chip", props.className, { removable, disabled })}
      style={props.style}
      id={props.id}
    >
      <div className="Chip__content">{props.children}</div>
      {!removable ? null : (
        <IconButton
          className="Chip__remove"
          renderIcon={() => <RemoveIcon />}
          disabled={disabled}
          onClick={(e) => {
            e.preventDefault();
            if (onRemove) onRemove();
          }}
        />
      )}
    </div>
  );
};

Chip.defaultProps = {
  removable: false,
  disabled: false,
} as Partial<Props>;

export default Chip;
