import React, { FunctionComponent, useEffect, useState, useRef } from "react";
import { BaseProps } from "@/types"
import "./RotatingArc.scss";
import classnames from "classnames";
import gsap from "gsap";

import BaseArc, { Props as BaseArcProps } from "@/components/ui/arcs/BaseArc/BaseArc";

export interface Props extends BaseProps, BaseArcProps {
    style?: React.CSSProperties;
    rotationSpeed?: number;
    rotateForward?: boolean;
    initialRotation?: number;
};


const RotatingArc: FunctionComponent<Props> = (props) => {
    const { rotationSpeed, rotateForward, className, style, initialRotation, ...rest } = props;

    const baseRef = useRef<SVGSVGElement>(null);
    const [rotationTween, setRotationTween] = useState<gsap.core.Tween | null>(null);

    useEffect(() => {
        gsap.set(baseRef.current!, { 
            rotationZ: initialRotation
        });
    }, [baseRef, initialRotation]);

    // Remake tween whenever one of the parameters changes (also sets it up initially)
    useEffect(() => {
        const directionSign = (rotateForward) ? "+" : "-";

        // Kill any already running tween
        if (rotationTween) {
            rotationTween.kill();
        }

        // Creat the tween
        const tween = gsap.to(baseRef.current!, { 
            rotateZ: `${directionSign}=360`, 
            repeat: -1,
            duration: rotationSpeed!,
            ease: "linear"
        });

        // Update the state
        setRotationTween(tween);
    }, [baseRef, rotationSpeed, rotateForward]);

    return (
        <div 
            className={classnames("RotatingArc", className)}
            style={style}
        >
            <BaseArc 
                {...rest}
                className="RotatingArc__base-arc"
                ref={baseRef}
            />
        </div>
    );
};

RotatingArc.defaultProps = {
    rotationSpeed: 6000,
    rotateForward: true,
    initialRotation: 0
} as Partial<Props>;

export default RotatingArc;