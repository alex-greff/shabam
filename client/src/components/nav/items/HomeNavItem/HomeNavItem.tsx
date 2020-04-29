import React, { Component } from "react";
import { AppLinkProps } from "@/types";
import "./HomeNavItem.scss";
import classnames from "classnames";

import NavItemBase from "@/components/nav/items/NavItemBase/NavItemBase";

export interface Props extends AppLinkProps {

};

class HomeNavItem extends Component<Props, any> {
    static defaultProps = {

    } as Partial<Props>;

    render() {
        return (
            <NavItemBase 
                { ...this.props }
                className={classnames("HomeNavItem", this.props.className)} 
            >
                <span className="HomeNavItem__text-first">Sha</span>
                <span className="HomeNavItem__text-second">bam</span>
            </NavItemBase>
        );
    }
}

export default HomeNavItem;