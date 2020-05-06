import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Home.scss";
import classnames from "classnames";

import Page, { Props as PageProps } from "@/components/page/Page";

export interface Props extends BaseProps, PageProps {

}

const Home: FunctionComponent<Props> = (props) => {
    return (
        <Page 
            {...props}
            id="Home" 
            className={classnames(props.className)}
        >
            Home View
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
            content
            <br/>
        </Page>
    );
};

export default Home;