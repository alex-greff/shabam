import React, { FunctionComponent, useState } from "react";
import { BaseProps } from "@/types"
import "./SigninForm.scss";
import classnames from "classnames";
import { useForm } from "react-hook-form";
import { withRouter, RouteComponentProps } from "react-router-dom";

import * as API from "@/api";

import FormButton from "@/components/ui/forms/button/FormButton/FormButton";
import FormInput from "@/components/ui/forms/input/FormInput/FormInput";

import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";

export interface Props extends BaseProps, RouteComponentProps {

};

interface FormData {
    username: string;
    password: string;
}

// TODO: put in signup form
// const validateUsername = async (username: string) => {
//     const isAvailable = await API.checkUsername(username);

//     return isAvailable || "Username not available";
// }

const SigninForm: FunctionComponent<Props> = (props) => {
    const [submitting, setSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const { register, setValue, handleSubmit, errors, setError, reset } = useForm<FormData>({
        mode: "onChange",
    });

    const onSubmit = handleSubmit(async (data) => {
        setSubmitting(true);

        try {
            const signedIn = await API.signin(data.username, data.password);

            console.log("Signed in", signedIn);

            if (!signedIn) throw new Error("Not signed in");
        } catch(err) {
            setGlobalError("Invalid username or password");
            setSubmitting(false);
            return;
        }

        setSubmitting(false);

        // TODO: add a mechanism to direct back to the previous page 
        // (for when the user tries accessing a page when they're not logged in)
        props.history.push("/");
    });

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <form 
            className={classnames("SigninForm", props.className)}
            onSubmit={onSubmit}
        >
            <div className="SigninForm__title">
                Signin
            </div>

            <FormInput 
                className="SigninForm__username-input"
                ref={register({ 
                    required: "Username is required",
                })}
                error={errors.username}
                name="username"
                type="text"
                layoutStyle="minimal-condensed"
                renderTitle={() => "Username"}
                renderIcon={() => <PersonIcon />}
                disabled={submitting}
            />

            <FormInput 
                className="SigninForm__password-input"
                ref={register({ 
                    required: "Password is required"
                })}
                error={errors.password}
                type="password"
                name="password"
                layoutStyle="minimal-condensed"
                renderTitle={() => "Password"}
                renderIcon={() => <LockIcon />}
                disabled={submitting}
            />

            <FormButton 
                className="SigninForm__submit-button"
                type="submit"
                colorStyle="primary"
                disabled={submitting || hasErrors}
            >
                Signin
            </FormButton>

            <div className="SigninForm__global-error-container">
                {(!globalError) ? null : (
                    <div className="SigninForm__global-error">
                        { globalError }
                    </div>
                )}
            </div>
        </form>
    );
};

SigninForm.defaultProps = {

} as Partial<Props>;

export default withRouter(SigninForm);