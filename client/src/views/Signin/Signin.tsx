import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types/baseProps.ts"
import "./Signin.scss";
import classnames from "classnames";

const Signin: FunctionComponent<BaseProps> = (props) => {
    return (
        <div id="Signin" className={classnames(props.className)}>
            Signin View
        </div>
    );
};

export default Signin;