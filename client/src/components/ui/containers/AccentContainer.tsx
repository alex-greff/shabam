import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./AccentContainer.scss";
import classnames from "classnames";

const AccentContainer: FunctionComponent<BaseProps> = (props) => {
    return (
        <div 
            className={classnames("AccentContainer", props.className)}
            style={props.style}
            id={props.id}
        >
            <div className="AccentContainer__container">
                <div className="AccentContainer__accent"></div>
                <div className="AccentContainer__content">
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export default AccentContainer;