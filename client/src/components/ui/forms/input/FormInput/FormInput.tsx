import React, { useState } from "react";
import "./FormInput.scss";
import classnames from "classnames";
import * as Utilities from "@/utilities";

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    layoutStyle?: "minimal-condensed" | "minimal" | "classic";
    renderTitle?: () => React.ReactNode;
    type?: "text" | "password";
    renderIcon?: () => React.ReactNode;
};

const FormInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { layoutStyle, renderIcon, renderTitle, ...rest } = props;
    const [id] = useState(Utilities.generateId());

    return (
        <div 
            className={classnames(
                "FormInput",
                props.className, 
                { [`layout-style-${layoutStyle!}`]: layoutStyle }
            )}
        >
            <input
                {...rest}
                className="FormInput__input"
                ref={ref}
                id={id}
            />

            {/* Note: this MUST be after FormInput__input */}
            {(!renderTitle) ? null : (
                <label 
                    className="FormInput__title"
                    htmlFor={id}
                >
                    { renderTitle() }
                </label>
            )}

            {/* Note: this MUST be two away from FormInput__input */}
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
    );
});

FormInput.defaultProps = {
    layoutStyle: "classic",
    type: "text"
} as Partial<Props>;

export default FormInput;