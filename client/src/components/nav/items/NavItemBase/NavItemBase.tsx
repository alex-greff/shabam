import React, { FunctionComponent } from "react";
import { BaseProps, AppRouteComponentProps, AppLocationState } from "@/types";
import "./NavItemBase.scss";
import classnames from "classnames";
import { Link, withRouter, matchPath } from "react-router-dom";
import { LocationDescriptor } from "history";
import { Duration } from "@/utilities/transitionUtilities";

export interface Props extends BaseProps {
    path: string;
    transitionId?: string;
    transitionDuration?: Duration;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => unknown;
};

const NavItem: FunctionComponent<Props & AppRouteComponentProps> = (props) => {
    const { 
        className, 
        path, 
        transitionId, 
        transitionDuration, 
        onClick,
        ...rest} = props;

    const isActive = !!matchPath(props.location.pathname, path);

    const to: LocationDescriptor<AppLocationState> = {
        pathname: path,
        state: {
            transitionId,
            transitionDuration,
            prevPathname: props.location.pathname
        }
    }

    return (
        <Link 
            to={to}
            className={classnames("NavItemBase", className, { "active": isActive })}
            style={props.style}
            id={props.id}
            onClick={onClick}
        >
            {props.children}
        </Link>
    );
};

NavItem.defaultProps = {
    
} as Partial<Props>;

export default withRouter(NavItem);