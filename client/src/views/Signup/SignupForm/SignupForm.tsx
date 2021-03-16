import React, { FunctionComponent, useState } from "react";
import { BaseProps } from "@/types";
import "./SignupForm.scss";
import classnames from "classnames";
import { useForm } from "react-hook-form";
import { BackNavigation } from "@/utilities";
import { useTransitionHistory } from "react-route-transition";
import { accountStore } from "@/store/account/account.store";

import FormButton from "@/components/ui/forms/button/FormButton/FormButton";
import FormInput from "@/components/ui/forms/input/FormInput/FormInput";

import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import {
  useSignupMutation
} from "@/graphql-apollo.g.d";
import { useGraphqlRequestSdk } from "@/hooks/useGraphqlRequestSdk";

export interface Props extends BaseProps {}

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
}

const SignupForm: FunctionComponent<Props> = (props) => {
  const history = useTransitionHistory();
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const {
    register,
    setValue,
    handleSubmit,
    errors,
    setError,
    reset,
    watch
  } = useForm<FormData>({ mode: "onChange" });
  const currPassword = watch("password", "");

  const graphqlSdk = useGraphqlRequestSdk();

  // errorPolicy = "all" gives the errors on the result object
  const [runSignupMutation] = useSignupMutation({ errorPolicy: "all" });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);

    const { username, password } = data;

    const signedUp = await runSignupMutation({
      variables: { username, password },
    });

    if (signedUp.errors) {
      setGlobalError("An error occurred while signing up");
      setSubmitting(false);
      return;
    }

    const token = signedUp.data!.signup.access_token;

    // Update the mobx store
    accountStore.setLoggedIn(username, token);

    setSubmitting(false);

    // Navigate back to the previous page, if given
    if (BackNavigation.hasBackPath) {
      BackNavigation.clearBackPath();
      history.push(BackNavigation.backPath!);
    } else {
      history.push("/");
    }
  });

  const validateUsername = async (username: string) => {
    const data = await graphqlSdk.CheckUsernameAvailability({ username });
    const isAvailable = data.checkUsernameAvailability;

    return isAvailable || "Username not available";
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    const passwordsMatch = currPassword === confirmPassword;

    return passwordsMatch || "Passwords do not match";
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      className={classnames("SignupForm", props.className)}
      style={props.style}
      id={props.id}
      onSubmit={onSubmit}
    >
      <div className="SignupForm__title">Signup</div>

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
          required: "Password is required",
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
        {!globalError ? null : (
          <div className="SignupForm__global-error">{globalError}</div>
        )}
      </div>
    </form>
  );
};

SignupForm.defaultProps = {} as Partial<Props>;

export default SignupForm;
