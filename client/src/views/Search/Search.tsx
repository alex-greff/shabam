import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Search.scss";
import classnames from "classnames";
import * as NotificationManager from "@/managers/NotificationManager";

import PageView from "@/components/page/PageView/PageView";

export interface Props extends BaseProps {

}

const Search: FunctionComponent<Props> = (props) => {
    const temp = () => NotificationManager.showErrorNotification("hi", 500000);

    return (
        <PageView 
            id="Search" 
            className={classnames(props.className)}
        >
            Search View

            <br />

            <button onClick={temp}>Click Me</button>
        </PageView>
    );
};

export default Search;