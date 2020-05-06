import React, { Component, RefObject } from "react";
import { BaseProps } from "@/types";
import "./NavBar.scss";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { withSize, SizeMeProps, WithSizeProps } from "react-sizeme";
import classnames from "classnames";
import * as Utilities from "@/utilities";

import HomeNavItem from "@/components/nav/items/HomeNavItem/HomeNavItem";
import NavItem from "@/components/nav/items/NavItem/NavItem";
import AccountControls from "@/components/account/AccountControls/AccountControls";

export interface Props extends BaseProps, RouteComponentProps, WithSizeProps {
    scrollAmount: number;
    width: number;
}


// This just keeps it quiet until they get the declaration working with decorators
// Source: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/24077
@(withRouter as any)
@(withSize({ monitorWidth: true, monitorHeight: true, refreshRate: 50 }) as any)
class NavBar extends Component<Props, any> {
    static defaultProps = {

    } as Props;

    componentDidUpdate(prevProps: Props) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        
    }

    render() {
        const { className, width, scrollAmount } = this.props;
        const mobile = Utilities.getBreakpoint(width!) <= Utilities.Breakpoint.phone;
        const scrolled = scrollAmount > 0;

        return (
            <nav 
                id="NavBar" 
                className={classnames(className, { mobile, scrolled })}
            >
                <div className="NavBar__content">
                    <HomeNavItem 
                        className="NavBar__home-nav-item" 
                        path="/"
                    />

                    <div className="NavBar__right-items">
                        {(mobile) ? null : (
                            <>
                                <div className="NavBar__nav-items">
                                    <NavItem 
                                        path="/search"
                                    >
                                        Search
                                    </NavItem>
                                    <NavItem 
                                        path="/catalog"
                                        transition="fade"
                                    >
                                        Catalog
                                    </NavItem>
                                </div>
                                <div className="NavBar__divider-line">&nbsp;</div>
                            </>
                        )}

                        <AccountControls className="NavBar__account-controls" />

                        {/* TODO: render the actual hamburger icon here */}
                        {(!mobile) ? null : (
                            <div>=</div>
                        )}
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar;