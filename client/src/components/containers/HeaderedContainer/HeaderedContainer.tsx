import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./HeaderedContainer.scss";
import classnames from "classnames";

export interface Props extends BaseProps {
  renderHeader?: () => JSX.Element;
  headerClassName?: string;
  includeTitleStyles?: boolean;
}

const HeaderedContainer: FunctionComponent<Props> = (props) => {
  const { renderHeader, headerClassName, includeTitleStyles } = props;

  return (
    <div
      className={classnames("HeaderedContainer", props.className)}
      style={props.style}
      id={props.id}
    >
      <div className={classnames("HeaderedContainer__header", headerClassName, { "include-title-styles": includeTitleStyles })}>
        {/* Render header */}
        {renderHeader ? renderHeader() : null}
      </div>
      {/* Render content */}
      {props.children}
    </div>
  );
};

HeaderedContainer.defaultProps = {
  includeTitleStyles: true
} as Partial<Props>;

export default HeaderedContainer;
