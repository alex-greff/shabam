import React, { FunctionComponent, useContext } from "react";
import { BaseProps } from "@/types";
import "./PageView.scss";
import classnames from "classnames";
import { NavBarHeightContext } from "@/contexts/NavBarHeightContext";

export interface Props extends BaseProps {
  id?: string;
  ignoreNavbarHeight?: boolean;
  style?: Omit<React.CSSProperties, "marginTop" | "minHeight">;
}

const PageView: FunctionComponent<Props> = (props) => {
  const navbarHeight = useContext(NavBarHeightContext);

  return (
    <div
      id={props.id}
      className={classnames("PageView", props.className)}
      style={{
        ...props.style,
        marginTop: !props.ignoreNavbarHeight ? `${navbarHeight}px` : 0,
        minHeight: !props.ignoreNavbarHeight
          ? `calc(100vh - ${navbarHeight}px)`
          : "100vh",
      }}
    >
      {props.children}
    </div>
  );
};

PageView.defaultProps = {
  ignoreNavbarHeight: false,
} as Partial<Props>;

export default PageView;
