import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./AccountCatalog.scss";
import classnames from "classnames";

const AccountCatalog: FunctionComponent<BaseProps> = (props) => {
    return (
        <div id="AccountCatalog" className={classnames(props.className)}>
            Account Catalog View
        </div>
    );
};

export default AccountCatalog;