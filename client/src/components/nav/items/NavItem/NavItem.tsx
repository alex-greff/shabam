import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types/baseProps.ts";
import "./NavItem.scss";
import classnames from "classnames";

import NavItemBase, { Props as NavItemBaseProps } from "@/components/nav/items/NavItemBase/NavItemBase";

export interface Props extends BaseProps, NavItemBaseProps {

};

const NavItem: FunctionComponent<Props> = (props) => {
    const { className, ...rest } = props;

    return (
        <NavItemBase 
            {...rest}
            className={classnames("NavItem", className)}
        >
            
        </NavItemBase>
    );
};

NavItem.defaultProps = {

} as Partial<Props>;

export default NavItem;