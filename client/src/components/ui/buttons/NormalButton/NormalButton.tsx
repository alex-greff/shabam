import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./NormalButton.scss";
import classnames from "classnames";

import ButtonBase, { Props as ButtonBaseProps } from "@/components/ui/buttons/ButtonBase/ButtonBase";

type Mode = "outlined" | "solid" | "none";

export interface Props extends BaseProps, ButtonBaseProps {
    outlined?: boolean;
    appearance?: Mode;
    size?: string;
};

const NormalButton: FunctionComponent<Props> = (props) => {
    const { appearance, outlined, className, ...rest } = props;
    
    return (
        <ButtonBase 
            {...rest}
            className={classnames(
                "NormalButton", 
                className, 
                { [`appearance-${appearance}`]: true }
            )}
        >
            {props.children}    
        </ButtonBase>
    );
};

NormalButton.defaultProps = {
    outlined: false,
    appearance: "none",
    size: "1.5rem"
} as Partial<Props>;

export default NormalButton;