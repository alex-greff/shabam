import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types/baseProps.ts";
import "./NavItemBase.scss";
import classnames from "classnames";
import { Link, LinkProps, RouteComponentProps, withRouter } from "react-router-dom";


export interface Props extends BaseProps, Pick<LinkProps, "to"> {

};

const NavItem: FunctionComponent<Props & RouteComponentProps> = (props) => {
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