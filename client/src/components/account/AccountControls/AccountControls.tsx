import React, { FunctionComponent, useState } from "react";
import { BaseProps } from "@/types";
import "./AccountControls.scss";
import classnames from "classnames";
import { observer } from "mobx-react";
import { accountStore } from "@/store/account/account.store";
import { CSSTransition } from "react-transition-group";
import { useSignoutMutation } from "@/graphql-apollo.g.d";
import useOutsideClick from "@/hooks/useOutsideClick";

import NormalButton from "@/components/ui/buttons/NormalButton/NormalButton";
import IconButton from "@/components/ui/buttons/IconButton/IconButton";

import ExpandIcon from "@/components/ui/icons/ExpandIcon/ExpandIcon";
import AccountIcon from "@material-ui/icons/Person";
import LogoutIcon from "@material-ui/icons/ExitToApp";

interface Props extends BaseProps {
  onNavItemClick?: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLDivElement>
  ) => any;
}

const AccountControls: FunctionComponent<Props> = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const rootRef = useOutsideClick<HTMLDivElement>(() => {
    // Close the dropdown if the click was outside the element
    if (dropdownOpen)
      setDropdownOpen(false);
  }, [dropdownOpen]);

  const [runSignout] = useSignoutMutation();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogoutClick = async () => {
    await runSignout();
    accountStore.setLoggedOut();
  };

  const loggedIn = accountStore.loggedIn;

  const renderLoggedInControls = () => {
    const username = accountStore.username!;

    return (
      <>
        <div className="AccountControls__logged-in" onClick={toggleDropdown}>
          <div className="AccountControls__username">{username}</div>
          <ExpandIcon
            className="AccountControls__expand-icon"
            expanded={dropdownOpen}
          />
        </div>

        <CSSTransition
          in={dropdownOpen}
          timeout={200}
          classNames={"AccountControls-anim"}
          unmountOnExit={true}
        >
          <div className="AccountControls__dropdown">
            <IconButton
              className="AccountControls__account-button"
              renderIcon={() => <AccountIcon />}
              path={`/account/${accountStore.username}`}
            >
              Account
            </IconButton>

            <IconButton
              className="AccountControls__signout-button"
              renderIcon={() => <LogoutIcon />}
              onClick={handleLogoutClick}
            >
              Signout
            </IconButton>
          </div>
        </CSSTransition>
      </>
    );
  };

  const renderLoggedOutControls = () => {
    return (
      <div className="AccountControls__logged-out">
        <NormalButton
          className="AccountControls__signin-button"
          path="/signin"
          appearance="none"
          textColor="secondary"
          style={{ fontSize: "1.7rem" }}
          onClick={props.onNavItemClick}
        >
          Signin
        </NormalButton>

        <NormalButton
          className="AccountControls__signup-button"
          path="/signup"
          appearance="outlined"
          textColor="secondary"
          style={{ fontSize: "1.7rem" }}
          onClick={props.onNavItemClick}
        >
          Signup
        </NormalButton>
      </div>
    );
  };

  return (
    <div
      className={classnames("AccountControls", props.className)}
      style={props.style}
      id={props.id}
      ref={rootRef}
    >
      {loggedIn ? renderLoggedInControls() : renderLoggedOutControls()}
    </div>
  );
};

export default observer(AccountControls);
