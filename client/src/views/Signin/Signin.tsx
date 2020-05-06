import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Signin.scss";
import classnames from "classnames";

import Page, { Props as PageProps } from "@/components/page/Page";
import AccentContainer from "@/components/ui/containers/AccentContainer";
import SigninForm from "./SigninForm/SigninForm";

export interface Props extends BaseProps, PageProps {

}

const Signin: FunctionComponent<Props> = (props) => {
    return (
        <Page 
            {...props}
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
        </Page>
    );
};

export default Signin;