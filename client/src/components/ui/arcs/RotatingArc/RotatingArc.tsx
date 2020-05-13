import React, { FunctionComponent, useEffect, useState, useRef } from "react";
import { BaseProps } from "@/types"
import "./RotatingArc.scss";
import classnames from "classnames";
import gsap from "gsap";

import BaseArc, { Props as BaseArcProps } from "@/components/ui/arcs/BaseArc/BaseArc";

export interface Props extends BaseProps, BaseArcProps {
    rotationSpeed?: number;
};


const RotatingArc: FunctionComponent<Props> = (props) => {
    const { rotationSpeed, ...rest } = props;

    const baseRef = useRef<SVGSVGElement>(null);
    const [baseSpeed] = useState(rotationSpeed);
    const [rotationTween, setRotationTween] = useState<gsap.core.Tween | null>(null);

    // Setup tween
    useEffect(() => {
        const tween = gsap.to(baseRef.current!, { 
            rotateZ: "+=360", 
            repeat: -1,
            duration: baseSpeed! / 1000,
            ease: "linear"
        });
        setRotationTween(tween);
    }, [baseRef, baseSpeed]);

    // Change the time scale of the tween to compensate for any changes in rotationSpeed
    // after the initial setup
    useEffect(() => {
        const timeScale = baseSpeed! / rotationSpeed!;
        rotationTween?.timeScale(timeScale);
        console.log("Updating tween timescale to", timeScale);
    }, [rotationSpeed]);

    return (
        <div className={classnames("RotatingArc", props.className)}>
            <BaseArc 
                {...rest}
                className="RotatingArc__base-arc"
                ref={baseRef}
            />
        </div>
    );
};

RotatingArc.defaultProps = {
    rotationSpeed: 6000
} as Partial<Props>;

export default RotatingArc;