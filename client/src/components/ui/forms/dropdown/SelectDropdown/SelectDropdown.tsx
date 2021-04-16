import React, { FunctionComponent } from "react";
import "./SelectDropdown.scss";
import classnames from "classnames";
import Select, { Props as ReactSelectProps } from "react-select";

export interface Props extends ReactSelectProps {}

const SelectDropdown: FunctionComponent<Props> = (props) => {
  return (
    <Select
      {...props}
      className={classnames("SelectDropdown", props.className)}
      classNamePrefix="SelectDropdown"
    />
  );
};

SelectDropdown.defaultProps = {} as Partial<Props>;

export default SelectDropdown;
