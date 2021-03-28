import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./BackgroundContainer.scss";
import classnames from "classnames";

export interface Props extends BaseProps {

};

const BackgroundContainer: FunctionComponent<Props> = (props) => {
  return (
    <div 
      className={classnames("BackgroundContainer", props.className)}
      style={props.style}
      id={props.id}
    >
      {props.children}
    </div>
  );
};

BackgroundContainer.defaultProps = {

} as Partial<Props>;

export default BackgroundContainer;