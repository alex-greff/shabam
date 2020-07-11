import React, { FunctionComponent } from "react";
import { BaseProps, AppRouteComponentProps } from "@/types";
import "./NavItemBase.scss";
import classnames from "classnames";
import { withRouter, matchPath } from "react-router-dom";
import { useTransitionHistory } from "react-route-transition";

export interface Props extends BaseProps {
  path: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => unknown;
}

const NavItem: FunctionComponent<Props & AppRouteComponentProps> = (props) => {
  const { className, path, onClick, ...rest } = props;
  const history = useTransitionHistory();

  const isActive = !!matchPath(props.location.pathname, path);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    history.push(path);

    if (onClick) onClick(e);
  };

  return (
    <a
      href={path}
      className={classnames("NavItemBase", className, { active: isActive })}
      style={props.style}
      id={props.id}
      onClick={handleClick}
    >
      {props.children}
    </a>
  );
};

NavItem.defaultProps = {} as Partial<Props>;

export default withRouter(NavItem);
