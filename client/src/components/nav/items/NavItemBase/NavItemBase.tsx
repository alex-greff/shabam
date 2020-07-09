import React, { FunctionComponent } from "react";
import { BaseProps, AppRouteComponentProps, AppLocationState } from "@/types";
import "./NavItemBase.scss";
import classnames from "classnames";
import { Link, withRouter, matchPath } from "react-router-dom";
import { LocationDescriptor } from "history";
import { Duration } from "@/utilities/transitionUtilities";
import { useTransitionHistory } from 'react-route-transition';


export interface Props extends BaseProps {
    path: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => unknown;
};

const NavItem: FunctionComponent<Props & AppRouteComponentProps> = (props) => {
    const { 
        className, 
        path,
        onClick,
        ...rest } = props;
    const history = useTransitionHistory();

    const isActive = !!matchPath(props.location.pathname, path);

    // console.log("test", matchPath("/account/:id", "/account/test")); // TODO: remove

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        history.push(path);

        if (onClick) onClick(e);
    };

    return (
        <a 
            href={path}
            className={classnames("NavItemBase", className, { "active": isActive })}
            style={props.style}
            id={props.id}
            onClick={handleClick}
        >
            {props.children}
        </a>
    );
};

NavItem.defaultProps = {
    
} as Partial<Props>;

export default withRouter(NavItem);