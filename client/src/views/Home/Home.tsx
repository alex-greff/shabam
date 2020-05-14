import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Home.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";
import NormalButton from "@/components/ui/buttons/NormalButton/NormalButton";

export interface Props extends BaseProps {

}

const Home: FunctionComponent<Props> = (props) => {
    return (
        <PageView 
            id="Home" 
            className={classnames(props.className)}
            ignoreNavbarHeight={true}
        >
            Home View

            <br />

            <NormalButton
                path="/search"
            >
                Click me
            </NormalButton>
        </PageView>
    );
};

export default Home;