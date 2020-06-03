import React, { FunctionComponent } from "react";
import "./RecordButton.scss";
import classnames from "classnames";

import CircularButton, { Props as CircularButtonProps } from "@/components/ui/buttons/CircularButton/CircularButton";

export interface Props extends CircularButtonProps {
    
};

const RecordButton: FunctionComponent<Props> = (props) => {
    return (
        <CircularButton
            {...props}
            className={classnames("RecordButton", props.className)}
        >
            <div 
                className="RecordButton__center"
                style={{
                    width: `calc(${props.size} / 3)`,
                    height: `calc(${props.size} / 3)`
                }}
            ></div>
        </CircularButton>
    );
};

RecordButton.defaultProps = {
    size: "4rem"
} as Partial<Props>;

export default RecordButton;