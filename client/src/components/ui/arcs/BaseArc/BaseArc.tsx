import React, { FunctionComponent, forwardRef } from "react";
import { BaseProps } from "@/types"
import "./BaseArc.scss";
import classnames from "classnames";

export interface Props extends BaseProps {
    stroke?: number;
    progress?: number;
};

const RADIUS = 50;

const BaseArc = forwardRef<SVGSVGElement, Props>((props, ref) => {
    const { progress, stroke } = props;
    const normalizedRadius = RADIUS - stroke! / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress! / 100 * circumference;

    return (
        <svg 
            className={classnames("BaseArc", props.className)}
            viewBox="0 0 100 100"
            ref={ref}
        >
            <circle 
                stroke-dasharray={circumference + ' ' + circumference}  
                style={{ strokeDashoffset: strokeDashoffset }}
                r={normalizedRadius} 
                fill="transparent"
                stroke-width={stroke}
                stroke-linecap="butt"
                cx={RADIUS}
                cy={RADIUS}
            />
        </svg>
    );
});

BaseArc.defaultProps = {
    stroke: 0.5,
    progress: 100
} as Partial<Props>;

export default BaseArc;