import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types/baseProps.ts"
import "./Home.scss";
import classnames from "classnames";

const Home: FunctionComponent<BaseProps> = (props) => {
    return (
        <div id="Home" className={classnames(props.className)}>
            Home View
        </div>
    );
};

export default Home;