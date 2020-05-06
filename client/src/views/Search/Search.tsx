import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Search.scss";
import classnames from "classnames";

import Page, { Props as PageProps } from "@/components/page/Page";

export interface Props extends BaseProps, PageProps {

}

const Search: FunctionComponent<Props> = (props) => {
    return (
        <Page 
            {...props}
            id="Search" 
            className={classnames(props.className)}
        >
            Search View
        </Page>
    );
};

export default Search;