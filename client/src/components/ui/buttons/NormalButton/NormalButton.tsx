import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./NormalButton.scss";
import classnames from "classnames";

import ButtonBase, { Props as ButtonBaseProps } from "@/components/ui/buttons/ButtonBase/ButtonBase";

export interface Props extends BaseProps, ButtonBaseProps {
    outlined?: boolean;
};

const NormalButton: FunctionComponent<Props> = (props) => {
    const { outlined, className, ...rest } = props;
    
    return (
        <ButtonBase 
            {...rest}
            className={classnames("NormalButton", className, { outlined })}
        >
            {props.children}    
        </ButtonBase>
    );
};

NormalButton.defaultProps = {
    outlined: false
} as Partial<Props>;

export default NormalButton;