import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Signin.scss";
import classnames from "classnames";

import AccentContainer from "@/components/ui/containers/AccentContainer";
import SigninForm from "./SigninForm/SigninForm";

const Signin: FunctionComponent<BaseProps> = (props) => {
    return (
        <div id="Signin" className={classnames(props.className)}>
            <AccentContainer
                className="Signin__accent-container"
            >
                <div className="Signin__content">
                    <SigninForm 
                        className="Signin__form"
                    />
                </div>
            </AccentContainer>
        </div>
    );
};

export default Signin;