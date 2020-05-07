import React, { Component } from "react";
import { BaseProps } from "@/types"
import "./AccountControls.scss";
import classnames from "classnames";
import { observer } from "mobx-react";
import { accountStore } from "@/store/account/account.store";
// import Popup from "reactjs-popup";
// import { CSSTransition } from 'react-transition-group';

import NormalButton from "@/components/ui/buttons/NormalButton/NormalButton";

interface Props extends BaseProps {

};

interface State {

};

@observer
class AccountControls extends Component<Props, State> {
    static defaultProps = {

    } as Partial<Props>;

    constructor(props: Props) {
       super(props);
    }

    render() {
        const loggedIn = accountStore.loggedIn;

        return (
            <div className={classnames("AccountControls", this.props.className)}>
                { (loggedIn) ? this.renderLoggedInControls() : this.renderLoggedOutControls() }
            </div>
        );
    }

    private renderLoggedInControls() {
        const username = accountStore.username!;

        return (
            <div className="AccountControls__logged-in">
                { username }
            </div>

            // <Popup
            //     trigger={open => (
            //         <div className="AccountControls__logged-in">{ username }</div>
            //     )}
            //     className="AccountControls__dropdown"
            //     position="bottom right"
            //     closeOnDocumentClick
            // >
            //     <CSSTransition
            //         addEndListener={() => {}}
            //         classNames="page"
            //     >
            //         <span> Popup content </span>
            //     </CSSTransition>
            // </Popup>
        );
    }

    private renderLoggedOutControls() {
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
}

export default AccountControls;