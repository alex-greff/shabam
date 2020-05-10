import React, { FunctionComponent } from "react";
import { BaseProps, AppRouteComponentProps, AppLocationState } from "@/types";
import "./NavItemBase.scss";
import classnames from "classnames";
import { Link, withRouter, matchPath } from "react-router-dom";
import { LocationDescriptor } from "history";

export interface Props extends BaseProps {
    path: string;
    transition?: string;
};

const NavItem: FunctionComponent<Props & AppRouteComponentProps> = (props) => {
    const { className, path, transition, ...rest} = props;

    const isActive = !!matchPath(props.location.pathname, path);

    const to: LocationDescriptor<AppLocationState> = {
        pathname: path,
        state: {
            transition,
            prevPathname: props.location.pathname
        }
    }

    return (
        <Link 
            to={to}
            className={classnames("NavItemBase", className, { "active": isActive })}
        >
            {props.children}
        </Link>
    );
};

NavItem.defaultProps = {
    
} as Partial<Props>;

export default withRouter(NavItem);