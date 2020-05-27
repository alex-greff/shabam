import React, { FunctionComponent, useState } from "react";
import { BaseProps } from "@/types"
import "./SignupForm.scss";
import classnames from "classnames";
import { useForm } from "react-hook-form";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { BackNavigation } from "@/utilities";

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
    confirmPassword: string;
}

const SignupForm: FunctionComponent<Props> = (props) => {
    const [submitting, setSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const { register, setValue, handleSubmit, errors, setError, reset, watch } = useForm<FormData>({
        mode: "onChange",
    });
    const currPassword = watch("password", "");

    const onSubmit = handleSubmit(async (data) => {
        setSubmitting(true);

        try {
            const signedUp = await API.signup(data.username, data.password);
            if (!signedUp) throw new Error("Not signed up");

            const signedIn = await API.signin(data.username, data.password);
            if (!signedIn) throw new Error("Not signed in");
        } catch(err) {
            setGlobalError("An error occurred while signing up");
            setSubmitting(false);
            return;
        }

        setSubmitting(false);

        // Navigate back to the previous page, if given
        if (BackNavigation.hasBackPath) {
            BackNavigation.clearBackPath();
            props.history.push(BackNavigation.backPath!);
        } else {
            props.history.push("/");
        }
    });

    const validateUsername = async (username: string) => {
        const isAvailable = await API.checkUsername(username);
    
        return isAvailable || "Username not available";
    }

    const validateConfirmPassword = (confirmPassword: string) => {
        const passwordsMatch = currPassword === confirmPassword;

        return passwordsMatch || "Passwords do not match";
    }

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <form 
            className={classnames("SignupForm", props.className)}
            style={props.style}
            id={props.id}
            onSubmit={onSubmit}
        >
            <div className="SignupForm__title">
                Signup
            </div>

            <FormInput 
                className="SignupForm__username-input"
                ref={register({ 
                    required: "Username is required",
                    validate: validateUsername
                })}
                error={errors.username}
                name="username"
                type="text"
                autoComplete="off"
                layoutStyle="minimal-condensed"
                renderTitle={() => "Username"}
                renderIcon={() => <PersonIcon />}
                disabled={submitting}
            />

            <FormInput 
                className="SignupForm__password-input"
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

            <FormInput 
                className="SignupForm__password-input"
                ref={register({ 
                    validate: validateConfirmPassword
                })}
                error={errors.confirmPassword}
                type="password"
                name="confirmPassword"
                layoutStyle="minimal-condensed"
                renderTitle={() => "Confirm Password"}
                renderIcon={() => <LockIcon />}
                disabled={submitting}
            />

            <FormButton 
                className="SignupForm__submit-button"
                type="submit"
                colorStyle="primary"
                disabled={submitting || hasErrors}
            >
                Signup
            </FormButton>

            <div className="SignupForm__global-error-container">
                {(!globalError) ? null : (
                    <div className="SignupForm__global-error">
                        { globalError }
                    </div>
                )}
            </div>
        </form>
    );
};

SignupForm.defaultProps = {

} as Partial<Props>;

export default withRouter(SignupForm);