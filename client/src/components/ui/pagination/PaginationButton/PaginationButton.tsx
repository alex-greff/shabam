import React, { VoidFunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./PaginationButton.scss";
import classnames from "classnames";

import NormalButton, { Props as NormalButtonProps } from "@/components/ui/buttons/NormalButton/NormalButton";

export interface Props extends BaseProps, Omit<NormalButtonProps, "children"> {
  page: number; // 0-indexed
  active?: boolean;
};

const PaginationButton: VoidFunctionComponent<Props> = (props) => {
  const { page, active, ...rest } = props;

  return (
    <NormalButton 
      {...rest}
      className={classnames("PaginationButton", props.className, { "active": active })}
      style={props.style}
      id={props.id}
      mode="grey"
      appearance="solid"
    >
      {page + 1}
    </NormalButton>
  );
};

PaginationButton.defaultProps = {
  active: false,
} as Partial<Props>;

export default PaginationButton;