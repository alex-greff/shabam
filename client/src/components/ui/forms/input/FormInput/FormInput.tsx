import React, { useState } from "react";
import "./FormInput.scss";
import classnames from "classnames";
import * as Utilities from "@/utilities";
import { FieldError } from "react-hook-form";

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    layoutStyle?: "minimal-condensed" | "minimal" | "classic";
    renderTitle?: () => React.ReactNode;
    type?: "text" | "password";
    renderIcon?: () => React.ReactNode;
    error?: FieldError;
};

const FormInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { 
        layoutStyle, 
        renderIcon, 
        renderTitle, 
        placeholder, 
        error,
        ...rest } = props;
    const [id] = useState(Utilities.generateId());

    const isMinimalCondensed = layoutStyle === "minimal-condensed";
    const placeholderNormalized = (isMinimalCondensed && !placeholder) ? " " : placeholder;

    const hasError = !!error;
    const hasErrorMessage = !!error?.message;

    return (
        <div 
            className={classnames(
                "FormInput",
                props.className, 
                { 
                    [`layout-style-${layoutStyle!}`]: layoutStyle,
                    'has-error': hasError
                }
            )}
        >
            <div className="FormInput__container">
                {/* Note: most of these items MUST be in this order to allow the stylesheet to work properly */}

                <input
                    {...rest}
                    className="FormInput__input"
                    placeholder={placeholderNormalized}
                    ref={ref}
                    id={id}
                />

                {(!renderTitle) ? null : (
                    <label 
                        className="FormInput__title"
                        htmlFor={id}
                    >
                        { renderTitle() }
                    </label>
                )}

                <span className="FormInput__accent-line"></span>

                {(!renderIcon) ? null : (
                    <label 
                        className="FormInput__icon-container"
                        htmlFor={id}
                    >
                        { renderIcon() }
                    </label>
                )}
            </div>

            <div className="FormInput__error-message-placeholder">
                {(hasError && !hasErrorMessage) ? null : (
                    <label 
                        className="FormInput__error-message"
                        htmlFor={id}
                    >
                        { error?.message }    
                    </label>
                )}
            </div>
        </div>
    );
});

FormInput.defaultProps = {
    layoutStyle: "minimal-condensed",
    type: "text"
} as Partial<Props>;

export default FormInput;