import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./PageNotFound.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";

export interface Props extends BaseProps {

}

const PageNotFound: FunctionComponent<Props> = (props) => {
    return (
        <PageView
            id="PageNotFound" 
            className={classnames(props.className)}
        >
            404 View
        </PageView>
    );
};

export default PageNotFound;