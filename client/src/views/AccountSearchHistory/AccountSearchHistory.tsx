import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./AccountSearchHistory.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";

export interface Props extends BaseProps {

}

const AccountSearchHistory: FunctionComponent<Props> = (props) => {
    return (
        <PageView
            id="AccountSearchHistory" 
            className={classnames(props.className)}
        >
            Account Search History View
        </PageView>
    );
};

export default AccountSearchHistory;