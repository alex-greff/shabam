import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./PageNotFound.scss";
import classnames from "classnames";

import Page, { Props as PageProps } from "@/components/page/Page";

export interface Props extends BaseProps, PageProps {

}

const PageNotFound: FunctionComponent<Props> = (props) => {
    return (
        <Page 
            {...props}
            id="PageNotFound" 
            className={classnames(props.className)}
        >
            404 View
        </Page>
    );
};

export default PageNotFound;