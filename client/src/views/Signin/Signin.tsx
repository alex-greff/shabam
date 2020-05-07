import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Signin.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";
import AccentContainer from "@/components/ui/containers/AccentContainer";
import SigninForm from "./SigninForm/SigninForm";

export interface Props extends BaseProps {

}

const Signin: FunctionComponent<Props> = (props) => {
    return (
        <PageView 
            id="Signin" 
            className={classnames(props.className)}
        >
            <AccentContainer
                className="Signin__accent-container"
            >
                <div className="Signin__content">
                    <SigninForm 
                        className="Signin__form"
                    />
                </div>
            </AccentContainer>
        </PageView>
    );
};

export default Signin;