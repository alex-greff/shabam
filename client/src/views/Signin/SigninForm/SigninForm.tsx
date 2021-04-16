import React, { FunctionComponent, useState } from "react";
import { BaseProps } from "@/types";
import "./SigninForm.scss";
import classnames from "classnames";
import { useForm } from "react-hook-form";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { BackNavigation } from "@/utilities";
import { useTransitionHistory } from "react-route-transition";

import { accountStore } from "@/store/account/account.store";

import FormButton from "@/components/ui/forms/button/FormButton/FormButton";
import FormInput from "@/components/ui/forms/input/FormInput/FormInput";

import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import { useSigninMutation } from "@/graphql-apollo.g.d";

export interface Props extends BaseProps {}

interface FormData {
  username: string;
  password: string;
}

const SigninForm: FunctionComponent<Props> = (props) => {
  const history = useTransitionHistory();
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormData>({ mode: "onChange" });

  // errorPolicy = "all" gives the errors on the result object
  const [runSigninMutation] = useSigninMutation({ errorPolicy: "all" });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);

    const { username, password } = data;

    const signedIn = await runSigninMutation({
      variables: { username, password },
    });

    if (signedIn.errors) {
      setGlobalError("Invalid username or password");
      setSubmitting(false);
      return;
    }

    const token = signedIn.data!.login.access_token;

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

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      className={classnames("SigninForm", props.className)}
      style={props.style}
      id={props.id}
      onSubmit={onSubmit}
    >
      <div className="SigninForm__title">Signin</div>

      <FormInput
        className="SigninForm__username-input"
        {...register("username", {
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
        {...register("password", {
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

      <FormButton
        className="SigninForm__submit-button"
        type="submit"
        colorStyle="primary"
        disabled={submitting || hasErrors}
      >
        Signin
      </FormButton>

      <div className="SigninForm__global-error-container">
        {!globalError ? null : (
          <div className="SigninForm__global-error">{globalError}</div>
        )}
      </div>
    </form>
  );
};

SigninForm.defaultProps = {} as Partial<Props>;

export default SigninForm;
