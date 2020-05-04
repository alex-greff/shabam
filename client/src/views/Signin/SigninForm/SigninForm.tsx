import React, { FunctionComponent, useState } from "react";
import { BaseProps } from "@/types"
import "./SigninForm.scss";
import classnames from "classnames";
import { useForm } from "react-hook-form";

import FormButton from "@/components/ui/forms/button/FormButton/FormButton";
import FormInput from "@/components/ui/forms/input/FormInput/FormInput";

import AccentContainer from "@/components/ui/containers/AccentContainer";
import PersonIcon from "@material-ui/icons/Person";

export interface Props extends BaseProps {

};

interface FormData {
    username: string;
    password: string;
}

const SigninForm: FunctionComponent<Props> = (props) => {
    const [submitting, setSubmitting] = useState(false);
    const { register, setValue, handleSubmit, errors, setError } = useForm<FormData>();

    const onSubmit = handleSubmit(async (data) => {
        console.log("Signin form data", data);
    });

    return (
        <form 
            className={classnames("SigninForm", props.className)}
            onSubmit={onSubmit}
        >
            <div className="SigninForm__title">
                Signin
            </div>

            <FormInput 
                placeholder="Hi"
                layoutStyle="minimal-condensed"
                renderTitle={() => "Username"}
                renderIcon={() => <PersonIcon/>}
            />

            <FormButton 
                className="SigninForm__submit-button"
                type="submit"
                colorStyle="primary"
            >
                Signin
            </FormButton>
        </form>
    );
};

SigninForm.defaultProps = {

} as Partial<Props>;

export default SigninForm;