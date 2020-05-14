import React, { FunctionComponent, useEffect, useState } from "react";
import { BaseProps } from "@/types";
import "./NavBar.scss";
import { withRouter, RouteComponentProps, matchPath } from "react-router-dom";
import { withSize, WithSizeProps } from "react-sizeme";
import classnames from "classnames";
import * as Utilities from "@/utilities";
import { TransitionUtilities } from "@/utilities";
import { CSSTransition } from "react-transition-group";

import HomeNavItem from "@/components/nav/items/HomeNavItem/HomeNavItem";
import NavItem from "@/components/nav/items/NavItem/NavItem";
import AccountControls from "@/components/account/AccountControls/AccountControls";

export interface Props extends BaseProps, RouteComponentProps, WithSizeProps {
    scrollAmount: number;
    width: number;
}

const NavBar: FunctionComponent<Props> = (props) => {
    const { className, width, scrollAmount, location } = props;

    const [isVisible, setIsVisible] = useState(false);

    const mobile = Utilities.getBreakpoint(width!) <= Utilities.Breakpoint.phone;
    const scrolled = scrollAmount > 0;

    useEffect(() => {
        const homeViewMatch = matchPath(location.pathname, "/");
        const isHomeView = !!homeViewMatch && homeViewMatch.isExact;

        if (isHomeView && isVisible) {
            setIsVisible(false);
        } else if (!isHomeView && !isVisible) {
            setIsVisible(true);
        }
    }, [location]);

    return (
        <nav 
            id="NavBar" 
            className={classnames(
                className, 
                { mobile, scrolled, "is-visible": isVisible },
            )}
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
                                    // transition="fade" // TODO: make sure to use TransitionUtilities
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
};

NavBar.defaultProps = {

} as Partial<Props>;

export default withRouter(withSize({ monitorWidth: true, monitorHeight: true, refreshRate: 50 })(NavBar));