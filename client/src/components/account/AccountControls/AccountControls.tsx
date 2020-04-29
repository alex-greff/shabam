import React, { Component } from "react";
import { BaseProps } from "@/types"
import "./AccountControls.scss";
import classnames from "classnames";
import { observer } from "mobx-react";
import { accountStore } from "@/store/account/account.store";

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
                 {(loggedIn) ? this.renderLoggedInControls() : this.renderLoggedOutControls() }
            </div>
        );
    }

    private renderLoggedInControls() {
        return (
            <div className="AccountControls__logged-in">
                TODO: Logged-In Stuff
            </div>
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