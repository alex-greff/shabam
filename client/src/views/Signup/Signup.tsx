import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Signup.scss";
import classnames from "classnames";

import Page, { Props as PageProps } from "@/components/page/Page";
import AccentContainer from "@/components/ui/containers/AccentContainer";
import SignupForm from "./SignupForm/SignupForm";

export interface Props extends BaseProps, PageProps {

}

const Signup: FunctionComponent<Props> = (props) => {
    return (
        <Page 
            {...props}
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
        </Page>
    );
};

export default Signup;