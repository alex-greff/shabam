import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types/baseProps.ts"
import "./Search.scss";
import classnames from "classnames";

const Search: FunctionComponent<BaseProps> = (props) => {
    return (
        <div id="Search" className={classnames(props.className)}>
            Search View
        </div>
    );
};

export default Search;