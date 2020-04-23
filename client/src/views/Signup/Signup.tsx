import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types/baseProps.ts"
import "./Signup.scss";
import classnames from "classnames";

const Signup: FunctionComponent<BaseProps> = (props) => {
    return (
        <div id="Signup" className={classnames(props.className)}>
            Signup View
        </div>
    );
};

export default Signup;