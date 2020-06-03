import React, { FunctionComponent } from "react";
import "./StopRecordButton.scss";
import classnames from "classnames";

import CircularButton, { Props as CircularButtonProps } from "@/components/ui/buttons/CircularButton/CircularButton";

export interface Props extends CircularButtonProps {
    
};

const RecordButton: FunctionComponent<Props> = (props) => {
    return (
        <CircularButton
            {...props}
            className={classnames("StopRecordButton", props.className)}
        >
            <div 
                className="StopRecordButton__center"
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