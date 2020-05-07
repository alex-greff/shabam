import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./AccountCatalog.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";

export interface Props extends BaseProps {

}

const AccountCatalog: FunctionComponent<Props> = (props) => {
    return (
        <PageView 
            id="AccountCatalog" 
            className={classnames(props.className)}
        >
            Account Catalog View
        </PageView>
    );
};

export default AccountCatalog;