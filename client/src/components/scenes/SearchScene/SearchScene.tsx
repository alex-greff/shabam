import React, { FunctionComponent, useEffect, useState } from "react";
import { BaseProps } from "@/types"
import "./SearchScene.scss";
import classnames from "classnames";
import { throttle } from "throttle-debounce";

import BaseArc from "@/components/ui/arcs/BaseArc/BaseArc";

const MAX_DEG = 5;

export interface Props extends BaseProps {

}

interface MousePositionState {
    x: number;
    y: number;
}

const SearchScene: FunctionComponent<Props> = (props) => {
    const [mousePosition, setMousePosition] = useState<MousePositionState>({ x: 0, y: 0 });

    const handleMouseMove = throttle(10, (e: MouseEvent) => {
        const height = document.body.clientHeight;
        const width = document.body.clientWidth;

        const xPercent = e.x / width;
        const yPercent = e.y / height;

        // console.log("Mouse move", e.x, e.y);
        // console.log(`Mouse move ${xPercent}% - ${yPercent}%`);

        setMousePosition({
            x: xPercent,
            y: yPercent
        });
    });

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handleMouseMove]);

    const rotateX = -1 * (mousePosition.y - 0.5) * 2 * MAX_DEG;
    const rotateY = (mousePosition.x - 0.5) * 2 * MAX_DEG;

    // console.log(`Rotation ${rotateX}deg, ${rotateY}deg`);

    return (
        <div className={classnames("SearchScene", props.className)}>
            <div 
                className="SearchScene__scene"
                style={{
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
                }}
            >
                <div className="SearchScene__main-circle"></div>

                <BaseArc 
                    className="SearchScene__test-arc"
                    stroke={0.5}
                    progress={20}
                />

                <BaseArc 
                    className="SearchScene__test-arc-2"
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