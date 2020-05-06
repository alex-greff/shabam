import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Catalog.scss";
import classnames from "classnames";

import Page, { Props as PageProps } from "@/components/page/Page";

export interface Props extends BaseProps, PageProps {

}

const Catalog: FunctionComponent<Props> = (props) => {
    return (
        <Page 
            {...props}
            id="Catalog" 
            className={classnames(props.className)}
        >
            Catalog View
        </Page>
    );
};

export default Catalog;