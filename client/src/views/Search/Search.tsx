import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Search.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";

export interface Props extends BaseProps {

}

const Search: FunctionComponent<Props> = (props) => {
    return (
        <PageView 
            id="Search" 
            className={classnames(props.className)}
        >
            Search View
        </PageView>
    );
};

export default Search;