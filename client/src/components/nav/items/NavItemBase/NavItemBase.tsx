import React, { FunctionComponent } from "react";
import { BaseProps, AppRouteComponentProps, AppLinkProps } from "@/types";
import "./NavItemBase.scss";
import classnames from "classnames";
import { Link, withRouter } from "react-router-dom";

export interface Props extends BaseProps, Pick<AppLinkProps, "to"> {

};

const NavItem: FunctionComponent<Props & AppRouteComponentProps> = (props) => {
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