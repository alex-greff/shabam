import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./AccountSearchHistory.scss";
import classnames from "classnames";

const AccountSearchHistory: FunctionComponent<BaseProps> = (props) => {
    return (
        <div id="AccountSearchHistory" className={classnames(props.className)}>
            Account Search History View
        </div>
    );
};

export default AccountSearchHistory;