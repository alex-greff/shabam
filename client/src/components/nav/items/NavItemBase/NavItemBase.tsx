import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./NavItemBase.scss";
import classnames from "classnames";
import { Link, LinkProps, RouteComponentProps, withRouter } from "react-router-dom";
import { StaticContext } from "react-router";

type LocationState = {
    test: string;
}

export interface Props extends BaseProps, Pick<LinkProps, "to"> {
// export interface Props extends BaseProps, RouteComponentProps<{}, StaticContext, LocationState>  {

};

const NavItem: FunctionComponent<Props & RouteComponentProps<{}, StaticContext, LocationState>> = (props) => {
    const isActive = props.location.pathname === props.to;

    const { className, ...rest} = props;

    return (
        <Link 
            to={props.to}
            className={classnames("NavItemBase", className, { "active": isActive })}
        >
            {props.children}
        </Link>
    );
};

NavItem.defaultProps = {

} as Partial<Props>;

export default withRouter(NavItem);