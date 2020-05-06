import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Account.scss";
import classnames from "classnames";

import Page, { Props as PageProps } from "@/components/page/Page";

export interface Props extends BaseProps, PageProps {

}


const Account: FunctionComponent<Props> = (props) => {
    return (
        <Page 
            {...props}
            id="Account" 
            className={classnames(props.className)}
        >
            Account View
        </Page>
    );
};

export default Account;