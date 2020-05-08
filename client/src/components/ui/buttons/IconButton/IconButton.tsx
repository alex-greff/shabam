import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./IconButton.scss";
import classnames from "classnames";

import NormalButton, { Props as NormalButtonProps } from "@/components/ui/buttons/NormalButton/NormalButton";

export interface Props extends BaseProps, NormalButtonProps {
    renderIcon?: () => JSX.Element;
};

const IconButton: FunctionComponent<Props> = (props) => {
    const { renderIcon, children, ...rest } = props;

    return (
        <NormalButton 
            {...rest}
            className={classnames("IconButton", props.className)}
        >
            <div className="IconButton__children">
                { children }
            </div>
            {(!renderIcon) ? null : (
                <div className="IconButton__icon">
                    { renderIcon() }
                </div>
            )}
        </NormalButton>
    );
};

IconButton.defaultProps = {

} as Partial<Props>;

export default IconButton;