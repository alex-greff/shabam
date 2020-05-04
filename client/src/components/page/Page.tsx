import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Page.scss";
import classnames from "classnames";

const Page: FunctionComponent<BaseProps> = (props) => {
    return (
        <div className={classnames("Page", props.className)}>
            {props.children}
        </div>
    );
};

export default Page;