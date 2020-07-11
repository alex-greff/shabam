import React, { FunctionComponent, useEffect, useState } from "react";
import { BaseProps } from "@/types";
import "./NavBar.scss";
import { withRouter, RouteComponentProps, matchPath } from "react-router-dom";
import { withSize, WithSizeProps } from "react-sizeme";
import classnames from "classnames";
import * as Utilities from "@/utilities";

import HomeNavItem from "@/components/nav/items/HomeNavItem/HomeNavItem";
import NavItem from "@/components/nav/items/NavItem/NavItem";
import AccountControls from "@/components/account/AccountControls/AccountControls";
import HamburgerMenu from "@/components/ui/icons/HamburgerMenu/HamburgerMenu";

export interface Props
  extends Omit<BaseProps, "id">,
    RouteComponentProps,
    WithSizeProps {
  scrollAmount: number;
  width: number;
}

const NavBar: FunctionComponent<Props> = (props) => {
  const { className, width, scrollAmount, location } = props;

  const [isVisible, setIsVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const handleNavItemClick = () => {
    if (dropdownOpen) {
      setDropdownOpen(false);
    }
  };

  const handleHamburgerMenuClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setDropdownOpen(!dropdownOpen);
  };

  const renderNavItems = () => (
    <>
      <NavItem path="/search" onClick={handleNavItemClick}>
        Search
      </NavItem>
      <NavItem path="/catalog" onClick={handleNavItemClick}>
        Catalog
      </NavItem>
      <NavItem path="/benchmark" onClick={handleNavItemClick}>
        Benchmark
      </NavItem>
    </>
  );

  return (
    <nav
      id="NavBar"
      className={classnames(className, {
        mobile,
        scrolled,
        "is-visible": isVisible,
        "dropdown-open": dropdownOpen,
      })}
      style={props.style}
    >
      <div className="NavBar__content">
        <HomeNavItem
          className="NavBar__home-nav-item"
          path="/"
          onClick={handleNavItemClick}
        />

        <div className="NavBar__right-items">
          {mobile ? null : (
            <>
              <div className="NavBar__nav-items">{renderNavItems()}</div>
              <div className="NavBar__divider-line">&nbsp;</div>
            </>
          )}

          <AccountControls
            className="NavBar__account-controls"
            onNavItemClick={handleNavItemClick}
          />

          {!mobile ? null : (
            <HamburgerMenu
              className="NavBar__hamburger-menu"
              open={dropdownOpen}
              disabled={false}
              onClick={handleHamburgerMenuClick}
            />
          )}
        </div>
      </div>

      {!mobile ? null : (
        <div className="NavBar__mobile-dropdown">
          <div className="NavBar__mobile-divider-line">&nbsp;</div>

          <div className="Navbar__mobile-nav-items">{renderNavItems()}</div>
        </div>
      )}
    </nav>
  );
};

NavBar.defaultProps = {} as Partial<Props>;

export default withRouter(
  withSize({ monitorWidth: true, monitorHeight: true, refreshRate: 50 })(NavBar)
);
