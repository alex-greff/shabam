import React, { Component } from "react";
import "./NavBar.scss";
import { withRouter, RouteComponentProps } from "react-router-dom";

import HomeNavItem from "@/components/nav/items/HomeNavItem/HomeNavItem";
import NavItem from "@/components/nav/items/NavItem/NavItem";
import AccountControls from "@/components/account/AccountControls/AccountControls";

export interface Props extends RouteComponentProps {

}

// This just keeps it quiet until they get the declaration working with decorators
// Source: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/24077
@(withRouter as any)
class NavBar extends Component<Props, any> {
    static defaultProps = {

    } as Partial<Props>;

    componentDidUpdate(prevProps: Props) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        
    }

    render() {
        return (
            <div id="NavBar">
                <HomeNavItem 
                    className="NavBar__home-nav-item" 
                    to="/"
                />

                <div className="NavBar__right-items">
                    <NavItem to="/search">Search</NavItem>
                    {/* <NavItem to="/catalog">Catalog</NavItem> */}
                    <NavItem to={{ pathname: "/catalog", state: { transition: "fade" }}}>Catalog</NavItem>

                    <div className="NavBar__divider-line">&nbsp;</div>

                    <AccountControls className="NavBar__account-controls" />
                </div>
            </div>
        );
    }
}

export default NavBar;