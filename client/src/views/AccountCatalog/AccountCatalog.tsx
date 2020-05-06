import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./AccountCatalog.scss";
import classnames from "classnames";

import Page, { Props as PageProps } from "@/components/page/Page";

export interface Props extends BaseProps, PageProps {

}

const AccountCatalog: FunctionComponent<Props> = (props) => {
    return (
        <Page 
            {...props}
            id="AccountCatalog" 
            className={classnames(props.className)}
        >
            Account Catalog View
        </Page>
    );
};

export default AccountCatalog;