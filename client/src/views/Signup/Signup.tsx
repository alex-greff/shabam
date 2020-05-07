import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Signup.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";
import AccentContainer from "@/components/ui/containers/AccentContainer";
import SignupForm from "./SignupForm/SignupForm";

export interface Props extends BaseProps {

}

const Signup: FunctionComponent<Props> = (props) => {
    return (
        <PageView 
            id="Signup" 
            className={classnames(props.className)}
        >
            <AccentContainer
                className="Signup__accent-container"
            >
                <div className="Signup__content">
                    <SignupForm 
                        className="Signup__form"
                    />
                </div>
            </AccentContainer>
        </PageView>
    );
};

export default Signup;