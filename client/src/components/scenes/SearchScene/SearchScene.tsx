import React, { FunctionComponent, useEffect, useState, createRef } from "react";
import { BaseProps, AppRouteComponentProps } from "@/types"
import "./SearchScene.scss";
import classnames from "classnames";
import { throttle } from "throttle-debounce";
import gsap, { TweenLite } from "gsap";
import { withRouter, matchPath } from "react-router-dom";

import { useTransition } from 'react-route-transition';

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

export interface Props extends Omit<BaseProps, "id"> {

}

interface MousePositionState {
    x: number;
    y: number;
}

const SEARCH_Z_TRANSFORM = -100;
const HOME_OUT_Z_TRANSFORM = 50;

// Selectors
const SCENE_REF_SEL = "#SearchScene .SearchScene__scene";
const SCENE_ROOT_REF_SEL = "#SearchScene";
const S_REF_SEL = "#SearchScene .SearchScene__main-circle-s";

const SearchScene: FunctionComponent<Props & AppRouteComponentProps> = (props) => {
    const { location } = props;

    const sceneRef = createRef<HTMLDivElement>();

    const [mousePosition, setMousePosition] = useState<MousePositionState>({ x: 0, y: 0 });
    const [isSearchView, setIsSearchView] = useState<boolean>(!!matchPath("/search", { path: window.location.pathname, exact: true, strict: false }));
    const [lockView, setLockView] = useState(true);
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

    // Handle route change animation effects
    useTransition({
        handlers: [
            {
                from: "/",
                to: "/search",
                // home-to-search
                onLeave: async () => {
                    setLockView(true);
                    setIsSearchView(true);

                    gsap.killTweensOf(SCENE_REF_SEL);

                    const anim1 = gsap.to(SCENE_REF_SEL,  {
                        duration: 0.8,
                        translateZ: SEARCH_Z_TRANSFORM,
                        ease: "power1.inOut",
                        onComplete: () => {
                            gsap.set(SCENE_ROOT_REF_SEL, { zIndex: 100 });
                        }
                    });

                    const anim2 = gsap.to(S_REF_SEL, {
                        duration: 0.8,
                        opacity: 1,
                        ease: "power1.inOut"
                    });

                    await Promise.all([anim1, anim2]);
                }
            },
            {
                from: "/search",
                to: "/",
                // search-to-home
                onEnter: async () => {
                    setIsSearchView(false);

                    gsap.killTweensOf(SCENE_REF_SEL);
                    gsap.set(SCENE_ROOT_REF_SEL, { zIndex: -1 });

                    const anim1 = gsap.to(SCENE_REF_SEL,  {
                        duration: 0.8,
                        translateZ: 0,
                        ease: "power1.inOut"
                    });

                    const anim2 = gsap.to(S_REF_SEL, {
                        duration: 0.8,
                        opacity: 0,
                        ease: "power1.inOut"
                    });

                    await Promise.all([anim1, anim2]);
                    
                    setLockView(false);
                }
            },
            {
                from: "/",
                to: "*",
                // home-to-other
                onEnter: async (data) => {
                    // Make sure we're not going to the root or search path
                    if (!!matchPath("/search", { path: data.to, exact: true, strict: false })
                        || !!matchPath("/", { path: data.to, exact: true, strict: false }))
                        return;

                    setLockView(true);

                    gsap.killTweensOf(SCENE_REF_SEL);

                    await gsap.to(SCENE_REF_SEL,  {
                        duration: 0.8,
                        translateZ: HOME_OUT_Z_TRANSFORM,
                        opacity: 0,
                        ease: "power1.inOut"
                    });
                }
            },
            {
                from: "*",
                to: "/",
                // other-to-home
                onEnter: async (data) => {
                    // Make sure we're not the search path or the root path
                    if (!!matchPath("/search", { path: data.from, exact: true, strict: false }) 
                        || !!matchPath("/", { path: data.from, exact: true, strict: false }))
                        return;

                    gsap.killTweensOf(SCENE_REF_SEL);
                    gsap.set(SCENE_ROOT_REF_SEL, { zIndex: -1 });
                    gsap.set(S_REF_SEL, {
                        opacity: 0,
                    });

                    await gsap.fromTo(SCENE_REF_SEL, {
                        translateZ: HOME_OUT_Z_TRANSFORM,
                        opacity: 0,
                    }, {
                        duration: 0.8,
                        translateZ: 0,
                        opacity: 1,
                        ease: "power1.inOut"
                    });

                    setLockView(false);
                }
            },
            {
                from: "/search",
                to: "*",
                // search-to-other
                onEnter: async (data) => {
                    // Make sure we're not going to the root path
                    if (!!matchPath("/", { path: data.to, exact: true, strict: false }))
                        return;

                    setIsSearchView(false);

                    gsap.killTweensOf(SCENE_REF_SEL);

                    await gsap.to(SCENE_REF_SEL,  {
                        duration: 0.5,
                        opacity: 0,
                        ease: "power1.inOut"
                    });
                }
            },
            {
                from: "*",
                to: "/search",
                // other-to-search
                onEnter: async (data) => {
                    // Make sure we're not going to the root or search path
                    if (!!matchPath("/", { path: data.from, exact: true, strict: false })
                        || !!matchPath("/search", { path: data.from, exact: true, strict: false }))
                        return;

                    setIsSearchView(true);

                    gsap.killTweensOf(SCENE_REF_SEL);

                    gsap.set(SCENE_ROOT_REF_SEL, { zIndex: 100 });
                    const anim1 = gsap.fromTo(SCENE_REF_SEL, {
                        translateZ: SEARCH_Z_TRANSFORM,
                        opacity: 0,
                    }, {
                        duration: 1,
                        opacity: 1,
                        ease: "power1.inOut"
                    });

                    const anim2 = gsap.fromTo(S_REF_SEL, {
                        opacity: 0,
                    }, {
                        duration: 0.8,
                        opacity: 1,
                        ease: "power1.inOut"
                    });

                    await Promise.all([anim1, anim2]);
                }
            },
        ]
    });

    const setInitAnimState = (isHomeView: boolean, isSearchView: boolean) => {
        setIsSearchView(isSearchView);

        gsap.killTweensOf(SCENE_REF_SEL);

        if (isHomeView) {
            setLockView(false);
            gsap.set(SCENE_ROOT_REF_SEL, {
                zIndex: -1
            });
            gsap.fromTo(SCENE_REF_SEL, {
                translateZ: 0,
                opacity: 0,
            }, {
                duration: 1,
                opacity: 1,
                ease: "power1.inOut"
            });
            gsap.set(S_REF_SEL, {
                opacity: 0
            });
        } else if (isSearchView) {
            setLockView(true);
            gsap.set(SCENE_ROOT_REF_SEL, {
                zIndex: 100
            });
            gsap.set(SCENE_REF_SEL, {
                translateZ: SEARCH_Z_TRANSFORM,
                opacity: 1
            });
            gsap.set(S_REF_SEL, {
                opacity: 1
            });
        } else { // other view
            setLockView(true);
            gsap.set(SCENE_REF_SEL, {
                opacity: 0
            });
        }
    };

    // Handle initial animation effects
    useEffect(() => {
        const currPathName = location.pathname;
        const isHomeView = !!matchPath(currPathName, { path: "/", exact: true, strict: false });
        const isSearchView = !!matchPath(currPathName, { path: "/search", exact: true, strict: false });

        // Play intro animation / setup initial values
        if (isFirstLoad) {
            setInitAnimState(isHomeView, isSearchView);

            setIsFirstLoad(false);
        }
    }, []);

    // Handles if the screws with the popstate
    useEffect(() => {
        const onPopState = () => {
            const currPathName = window.location.pathname;
            const isHomeView = !!matchPath(currPathName, { path: "/", exact: true, strict: false });
            const isSearchView = !!matchPath(currPathName, { path: "/search", exact: true, strict: false });

            setInitAnimState(isHomeView, isSearchView);
        };

        window.addEventListener("popstate", onPopState);

        return () => {
            window.removeEventListener("popstate", onPopState);
        };
    }, []);

    return (
        <div 
            className={classnames(
                "SearchScene", 
                props.className,
                { "is-search-view": isSearchView }
            )}
            style={props.style}
            id="SearchScene"
        >
            <div 
                className="SearchScene__scene"
                ref={sceneRef}
            >
                <div 
                    className={"SearchScene__main-circle"}
                >
                    <div 
                        className="SearchScene__main-circle-s"
                    >
                        S
                    </div>
                </div>

                <div 
                    className="SearchScene__arcs-container"
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