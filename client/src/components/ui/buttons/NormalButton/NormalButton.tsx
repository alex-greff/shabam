import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./NormalButton.scss";
import classnames from "classnames";

import ButtonBase, { Props as ButtonBaseProps } from "@/components/ui/buttons/ButtonBase/ButtonBase";

type Appearance = "outlined" | "solid" | "none";
type TextColor = "primary" | "secondary";
type Mode = "info" | "error" | "success" | "warning";

export interface Props extends BaseProps, ButtonBaseProps {
    outlined?: boolean;
    appearance?: Appearance;
    textColor?: TextColor;
    mode?: Mode;
    disabled?: boolean;
};

const NormalButton: FunctionComponent<Props> = (props) => {
    const { 
        appearance, 
        outlined, 
        className, 
        style, 
        textColor,
        mode,
        disabled,
        ...rest 
    } = props;
    
    return (
        <ButtonBase 
            {...rest}
            className={classnames(
                "NormalButton", 
                className, 
                { 
                    disabled,
                    [`appearance-${appearance}`]: true,
                    [`text-color-${textColor}`]: true,
                    [`mode-${mode}`]: true
                }
            )}
            style={style}
        >
            {props.children}    
        </ButtonBase>
    );
};

NormalButton.defaultProps = {
    outlined: false,
    appearance: "none",
    textColor: "primary",
    mode: "info",
    disabled: false
} as Partial<Props>;

export default NormalButton;