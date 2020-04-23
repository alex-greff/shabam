import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types/baseProps.ts"
import "./Catalog.scss";
import classnames from "classnames";

const Catalog: FunctionComponent<BaseProps> = (props) => {
    return (
        <div id="Catalog" className={classnames(props.className)}>
            Catalog View
        </div>
    );
};

export default Catalog;