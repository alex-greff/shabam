import React, { FunctionComponent, useEffect, useState, createRef } from "react";
import { BaseProps, AppRouteComponentProps } from "@/types"
import "./SearchScene.scss";
import classnames from "classnames";
import { throttle } from "throttle-debounce";
import { TweenLite } from "gsap";
import { withRouter, matchPath } from "react-router-dom";

import RotatingArc from "@/components/ui/arcs/RotatingArc/RotatingArc";

const MAX_DEG = 1;
const THROTTLE_DELAY = 100;
const TWEEN_DELAY = 300;

interface Arc {
    forward: boolean;
    speed: number; // seconds
    progress: number; // 0-100%
    distance: number; // px
    initialRotation: number; // degrees
    color: "primary" | "secondary" | "tertiary";
}

const ARC_STROKE = 3;

const ARCS: Arc[] = [
    // Group 1
    { forward: true, speed: 25, progress: 10, distance: 5, initialRotation: 0, color: "primary" },
    { forward: true, speed: 25, progress: 7, distance: 12, initialRotation: 20, color: "secondary" },
    // Group 2
    { forward: false, speed: 20, progress: 7, distance: 20, initialRotation: -90, color: "tertiary" },
    { forward: false, speed: 20, progress: 5, distance: 30, initialRotation: -100, color: "secondary" },
    // Group 3
    { forward: true, speed: 30, progress: 7, distance: 40, initialRotation: 180, color: "primary" },
    // Group 4
    { forward: false, speed: 30, progress: 7, distance: 35, initialRotation: -20, color: "tertiary" },
];

export interface Props extends BaseProps {

}

interface MousePositionState {
    x: number;
    y: number;
}

const SearchScene: FunctionComponent<Props & AppRouteComponentProps> = (props) => {
    const sceneRef = createRef<HTMLDivElement>();
    const [mousePosition, setMousePosition] = useState<MousePositionState>({ x: 0, y: 0 });

    // Handle tracking the mouse position state
    useEffect(() => {
        const handleMouseMove = throttle(THROTTLE_DELAY, false, (e: MouseEvent) => {
            const height = document.body.clientHeight;
            const width = document.body.clientWidth;
    
            const xPercent = e.x / width;
            const yPercent = e.y / height;
    
            setMousePosition({
                x: xPercent,
                y: yPercent
            });
        });

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    // Rotate the scene view to follow the mouse
    useEffect(() => {
        const rotateX = -1 * (mousePosition.y - 0.5) * 2 * MAX_DEG;
        const rotateY = (mousePosition.x - 0.5) * 2 * MAX_DEG;

        if (sceneRef.current) {
            TweenLite.to(sceneRef.current, TWEEN_DELAY / 1000, {
                rotationX: rotateX,
                rotationY: rotateY
            });
        }
    }, [mousePosition, sceneRef]);

    return (
        <div className={classnames("SearchScene", props.className)}>
            <div 
                className="SearchScene__scene"
                ref={sceneRef}
            >
                <div className="SearchScene__main-circle"></div>

                {ARCS.map((arc, num) => (
                    <div className="SearchScene__arc-container">
                        <RotatingArc 
                            className={`SearchScene__arc SearchScene__arc-num-${num} ${arc.color}`}
                            style={{
                                transform: `translateZ(${arc.distance}px)`
                            }}
                            rotateForward={arc.forward}
                            rotationSpeed={arc.speed}
                            stroke={ARC_STROKE}
                            progress={arc.progress}
                            initialRotation={arc.initialRotation}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

SearchScene.defaultProps = {

} as Partial<Props>;

export default withRouter(SearchScene);