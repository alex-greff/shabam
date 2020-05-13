import React, { FunctionComponent, useEffect, useState, createRef } from "react";
import { BaseProps } from "@/types"
import "./SearchScene.scss";
import classnames from "classnames";
import { throttle } from "throttle-debounce";
import { TweenLite } from "gsap";

import BaseArc from "@/components/ui/arcs/BaseArc/BaseArc";
import RotatingArc from "@/components/ui/arcs/RotatingArc/RotatingArc";

const MAX_DEG = 1;
const THROTTLE_DELAY = 100;
const TWEEN_DELAY = 300;

export interface Props extends BaseProps {

}

interface MousePositionState {
    x: number;
    y: number;
}

const SearchScene: FunctionComponent<Props> = (props) => {
    const sceneRef = createRef<HTMLDivElement>();
    const [mousePosition, setMousePosition] = useState<MousePositionState>({ x: 0, y: 0 });

    const [temp, setTemp] = useState(true);
    const [temp2, setTemp2] = useState(6000);

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

        setTimeout(() => {
            setTemp(false);
        }, 2000);

        setTimeout(() => {
            setTemp(true);
        }, 5000);

        setTimeout(() => {
            setTemp2(12000);
        }, 3000);

        setTimeout(() => {
            setTemp2(6000);
        }, 6000);

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

                {/* <BaseArc 
                    className="SearchScene__test-arc"
                    stroke={0.5}
                    progress={20}
                />

                <BaseArc 
                    className="SearchScene__test-arc-2"
                    stroke={0.5}
                    progress={10}
                /> */}

                <RotatingArc 
                    className="SearchScene__test-arc-3"
                    rotateForward={temp}
                    rotationSpeed={temp2}
                    stroke={0.5}
                    progress={10}
                />
            </div>
        </div>
    );
};

SearchScene.defaultProps = {

} as Partial<Props>;

export default SearchScene;