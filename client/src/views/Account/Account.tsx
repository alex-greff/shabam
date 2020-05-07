import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Account.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";

export interface Props extends BaseProps {

}


const Account: FunctionComponent<Props> = (props) => {
    return (
        <PageView 
            id="Account" 
            className={classnames(props.className)}
        >
            Account View
        </PageView>
    );
};

export default Account;