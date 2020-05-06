import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./AccountSearchHistory.scss";
import classnames from "classnames";

import Page, { Props as PageProps } from "@/components/page/Page";

export interface Props extends BaseProps, PageProps {

}

const AccountSearchHistory: FunctionComponent<Props> = (props) => {
    return (
        <Page 
            {...props}
            id="AccountSearchHistory" 
            className={classnames(props.className)}
        >
            Account Search History View
        </Page>
    );
};

export default AccountSearchHistory;