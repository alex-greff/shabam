import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Account.scss";
import classnames from "classnames";

const Account: FunctionComponent<BaseProps> = (props) => {
    return (
        <div id="Account" className={classnames(props.className)}>
            Account View
        </div>
    );
};

export default Account;