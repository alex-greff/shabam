import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./BreadcrumbTrail.scss";
import classnames from "classnames";

import DiagonalDividerLine from "@/components/ui/dividers/DiagonalDividerLine/DiagonalDividerLine";
import NormalButton from "@/components/ui/buttons/NormalButton/NormalButton";

export interface BreadcrumbTrailItem {
  name: string;
  location?: string;
  active?: boolean;
}

export interface Props extends BaseProps {
  items: BreadcrumbTrailItem[];
}

const BreadcrumbTrail: FunctionComponent<Props> = (props) => {
  const { items } = props;

  return (
    <div
      className={classnames("BreadcrumbTrail", props.className)}
      style={props.style}
      id={props.id}
    >
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 ? (
            <DiagonalDividerLine
              className="BreadcrumbTrail__divider"
              lineSize="2px"
              style={{
                marginTop: "5px",
                marginBottom: "5px",
              }}
            />
          ) : null}

          {item.location ? (
            <NormalButton
              className={classnames("BreadcrumbTrail__item", {
                active: item.active || false,
              })}
              path={item.location}
            >
              {item.name}
            </NormalButton>
          ) : (
            <div
              className={classnames("BreadcrumbTrail__item", {
                active: item.active || false,
              })}
            >
              {item.name}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

BreadcrumbTrail.defaultProps = {} as Partial<Props>;

export default BreadcrumbTrail;
