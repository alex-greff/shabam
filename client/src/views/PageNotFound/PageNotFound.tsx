import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types/baseProps.ts"
import "./PageNotFound.scss";
import classnames from "classnames";

const PageNotFound: FunctionComponent<BaseProps> = (props) => {
    return (
        <div id="PageNotFound" className={classnames(props.className)}>
            404 View
        </div>
    );
};

export default PageNotFound;