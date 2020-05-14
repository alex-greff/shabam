import React, { FunctionComponent, useEffect, useState, createRef } from "react";
import { BaseProps, AppRouteComponentProps } from "@/types"
import "./SearchScene.scss";
import classnames from "classnames";
import { throttle } from "throttle-debounce";
import gsap, { TweenLite } from "gsap";
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
    { forward: true, speed: 27, progress: 7, distance: 12, initialRotation: 20, color: "secondary" },
    // Group 2
    { forward: false, speed: 20, progress: 7, distance: 20, initialRotation: -90, color: "tertiary" },
    { forward: false, speed: 22, progress: 5, distance: 30, initialRotation: -100, color: "secondary" },
    // Group 3
    { forward: true, speed: 30, progress: 7, distance: 40, initialRotation: 180, color: "primary" },
    // Group 4
    { forward: false, speed: 33, progress: 7, distance: 35, initialRotation: -20, color: "tertiary" },
];

export interface Props extends BaseProps {

}

interface MousePositionState {
    x: number;
    y: number;
}

type AnimationState = 
    "other-to-search" 
    | "other-to-home" 
    | "search-to-other"
    | "home-to-other"
    | "home-to-search"
    | "search-to-home" 
    | null;

const SearchScene: FunctionComponent<Props & AppRouteComponentProps> = (props) => {
    const { location } = props;

    const sceneRef = createRef<HTMLDivElement>();
    const mainCircleRef = createRef<HTMLDivElement>();
    const arcsContainerRef = createRef<HTMLDivElement>();

    const [mousePosition, setMousePosition] = useState<MousePositionState>({ x: 0, y: 0 });
    const [lockView, setLockView] = useState(true);
    const [animationState, setAnimationState] = useState<AnimationState>(null);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

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
        const rotateX = (!lockView) ? -1 * (mousePosition.y - 0.5) * 2 * MAX_DEG : 0;
        const rotateY = (!lockView) ? (mousePosition.x - 0.5) * 2 * MAX_DEG : 0;

        if (sceneRef.current) {
            TweenLite.to(sceneRef.current, TWEEN_DELAY / 1000, {
                rotationX: rotateX,
                rotationY: rotateY
            });
        }
    }, [mousePosition, sceneRef, lockView]);

    // Handle route change
    useEffect(() => {
        const currPathName = location.pathname;
        const prevPathName = location.state?.prevPathname;

        const toHomeMatch = matchPath(currPathName, "/");
        const isToHomeView = !!toHomeMatch && toHomeMatch.isExact;
        const toSearchMatch = matchPath(currPathName, "/search");
        const isToSearchView = !!toSearchMatch && toSearchMatch.isExact;

        const fromHomeMatch = matchPath(prevPathName, "/");
        const isFromHomeView = !!fromHomeMatch && fromHomeMatch.isExact;
        const fromSearchMatch = matchPath(prevPathName, "/search");
        const isFromSearchView = !!fromSearchMatch && fromSearchMatch.isExact;

        // Update view lock
        if (isToHomeView) {
            setLockView(false);
        } else {
            setLockView(true);
        }

        if (isFirstLoad) return;

        // Update animation state
        if (isFromHomeView && isToSearchView) { // home to search screen
            setAnimationState("home-to-search");
        } else if (isFromSearchView && isToHomeView) { // search to home screen
            setAnimationState("search-to-home");
        } else if (!isFromHomeView && isToHomeView) { // other to home screen
            setAnimationState("other-to-home");
        } else if (!isFromSearchView && isToSearchView) { // other to search screen
            setAnimationState("other-to-search");
        } else if (isFromHomeView && !isToHomeView) { // home to other screen
            setAnimationState("home-to-other");
        } else if (isFromSearchView && !isToSearchView) { // search to other screen
            setAnimationState("search-to-other");
        } else { // other to other screen
            setAnimationState(null);
        }
    }, [location]);

    // Handle animation state changes
    useEffect(() => {
        const currPathName = location.pathname;
        const homeMatch = matchPath(currPathName, "/");
        const isHomeView = !!homeMatch && homeMatch.isExact;
        const searchMatch = matchPath(currPathName, "/search");
        const isSearchView = !!searchMatch && searchMatch.isExact;

        const SEARCH_Z_TRANSFORM = -100;
        const HOME_OUT_Z_TRANSFORM = 50;

        // Play intro animation / setup initial values
        if (isFirstLoad) {
            if (isHomeView) {
                gsap.fromTo(sceneRef.current!, {
                    translateZ: 0,
                    opacity: 0,
                }, {
                    duration: 1,
                    opacity: 1,
                    ease: "power1.inOut"
                });
            } else if (isSearchView) {
                gsap.set(sceneRef.current!, {
                    translateZ: SEARCH_Z_TRANSFORM,
                });
            } else { // other view
                gsap.set(sceneRef.current!, {
                    opacity: 0
                });
            }

            setIsFirstLoad(false);
        }

        // Run corresponding animation
        if (animationState === "home-to-search") {
            gsap.to(sceneRef.current!,  {
                duration: 0.8,
                translateZ: SEARCH_Z_TRANSFORM,
                ease: "power1.inOut"
            });

        } else if (animationState === "search-to-home") {
            gsap.to(sceneRef.current!,  {
                duration: 0.8,
                translateZ: 0,
                ease: "power1.inOut"
            });

        } else if (animationState === "home-to-other") {
            gsap.to(sceneRef.current!,  {
                duration: 0.8,
                translateZ: HOME_OUT_Z_TRANSFORM,
                opacity: 0,
                ease: "power1.inOut"
            });

        } else if (animationState === "search-to-other") {
            gsap.to(sceneRef.current!,  {
                duration: 0.5,
                opacity: 0,
                ease: "power1.inOut"
            });

        } else if (animationState === "other-to-home") {
            gsap.fromTo(sceneRef.current!, {
                translateZ: HOME_OUT_Z_TRANSFORM,
                opacity: 0,
            }, {
                duration: 0.8,
                translateZ: 0,
                opacity: 1,
                ease: "power1.inOut"
            });

        } else if (animationState === "other-to-search") {
            gsap.fromTo(sceneRef.current!, {
                translateZ: SEARCH_Z_TRANSFORM,
                opacity: 0,
            }, {
                duration: 1,
                opacity: 1,
                ease: "power1.inOut"
            });
        }
    }, [animationState]);

    const toSearchMatch = matchPath(location.pathname, "/search");
    const isToSearchView = !!toSearchMatch && toSearchMatch.isExact;

    return (
        <div className={classnames("SearchScene", props.className)}>
            <div 
                className={classnames(
                    "SearchScene__scene",
                    { "is-search-view": isToSearchView }
                )}
                ref={sceneRef}
            >
                <div 
                    className={"SearchScene__main-circle"}
                    ref={mainCircleRef}
                ></div>

                <div 
                    className="SearchScene__arcs-container"
                    ref={arcsContainerRef}
                >
                    {ARCS.map((arc, num) => (
                        <div 
                            className="SearchScene__arc-container"
                            key={`arc-num-${num}`}
                        >
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
        </div>
    );
};

SearchScene.defaultProps = {

} as Partial<Props>;

export default withRouter(SearchScene);