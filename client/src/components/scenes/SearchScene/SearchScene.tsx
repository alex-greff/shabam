import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./SearchScene.scss";
import classnames from "classnames";

export interface Props extends BaseProps {

};

const SearchScene: FunctionComponent<Props> = (props) => {
    const progress = 20;

    const radius = 50; // MUST be 50
    const stroke = 0.5;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const strokeDashoffset = circumference - progress / 100 * circumference;

    return (
        <div className={classnames("SearchScene", props.className)}>
            <div className="SearchScene__scene">
                <div className="SearchScene__main-circle"></div>

                <svg 
                    className="SearchScene__test-arc"
                    
                    viewBox="0 0 100 100"
                >
                    <circle 
                        stroke-dasharray={circumference + ' ' + circumference}  
                        style={{ strokeDashoffset: strokeDashoffset }}
                        r={normalizedRadius} 
                        fill="transparent"
                        stroke-width={stroke}
                        stroke-linecap="butt"
                        cx={radius}
                        cy={radius}
                    />
                </svg>
            </div>
        </div>
    );
};

SearchScene.defaultProps = {

} as Partial<Props>;

export default SearchScene;