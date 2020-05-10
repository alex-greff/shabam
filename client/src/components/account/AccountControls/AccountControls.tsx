import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import { BaseProps } from "@/types"
import "./AccountControls.scss";
import classnames from "classnames";
import { observer } from "mobx-react";
import { accountStore } from "@/store/account/account.store";
import * as API from "@/api";
import { CSSTransition } from 'react-transition-group';
import { TransitionUtilities } from "@/utilities";

import NormalButton from "@/components/ui/buttons/NormalButton/NormalButton";
import IconButton from "@/components/ui/buttons/IconButton/IconButton";

import ExpandIcon from "@/components/ui/icons/ExpandIcon/ExpandIcon";
import AccountIcon from "@material-ui/icons/Person";
import LogoutIcon from "@material-ui/icons/ExitToApp";

interface Props extends BaseProps {

};

const AccountControls: FunctionComponent<Props> = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);

    const handleDocumentClick = (e: MouseEvent) => {
        // Stop if the click was inside the element
        if (rootRef.current?.contains(e.target as Node)) {
            return;
        }

        // Close the dropdown if the click was outside the element
        if (dropdownOpen) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener("mousedown", handleDocumentClick, false);
      
        // returned function will be called on component unmount 
        return () => {
            window.removeEventListener("mousedown", handleDocumentClick, false);
        }
    }, [dropdownOpen]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }
    
    const handleLogoutClick = async () => {
        await API.signout();
    };

    const loggedIn = accountStore.loggedIn;

    const renderLoggedInControls = () => {
        const username = accountStore.username!;

        return (
            <>
                <div 
                    className="AccountControls__logged-in"
                    onClick={toggleDropdown}
                >
                    <div className="AccountControls__username">
                        { username }
                    </div>
                    <ExpandIcon 
                        className="AccountControls__expand-icon" 
                        expanded={dropdownOpen}
                    />
                </div>

                <CSSTransition
                    in={dropdownOpen}
                    timeout={200}
                    classNames={TransitionUtilities.getTransitionId("top-slide", "top-slide", "short")}
                    unmountOnExit={true}
                >
                    <div className="AccountControls__dropdown">
                        <IconButton 
                            className="AccountControls__account-button"
                            renderIcon={() => (<AccountIcon />)}
                            to={`/account/${accountStore.username}`}
                        >
                            Account
                        </IconButton>

                        <IconButton 
                            className="AccountControls__signout-button"
                            renderIcon={() => (<LogoutIcon />)}
                            onClick={handleLogoutClick}
                        >
                            Signout
                        </IconButton>
                    </div>
                </CSSTransition>
            </>
        );
    }
    
    const renderLoggedOutControls = () => {
        return (
            <div className="AccountControls__logged-out">
                <NormalButton 
                    className="AccountControls__signin-button"
                    to="/signin"
                >
                    Signin
                </NormalButton>

                <NormalButton 
                    className="AccountControls__signup-button"
                    to="/signup"
                    outlined
                >
                    Signup
                </NormalButton>
            </div>
        );
    }

    return (
        <div 
            className={classnames("AccountControls", props.className)}
            ref={rootRef}
        >
            { (loggedIn) ? renderLoggedInControls() : renderLoggedOutControls() }
        </div>
    );
};

export default observer(AccountControls);