import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classnames from "classnames";
import OverlayScrollbars from "overlayscrollbars";
import { TransitionUtilities } from "@/utilities";

export interface Props extends BaseProps {
    transition?: string;
    pageKey?: string;
    osInstance?: OverlayScrollbars | null;
};

interface FactoryProps {
    classNames: string;
    timeout: number;
}

const childFactoryCreator = (props: FactoryProps) => (child:any) => React.cloneElement(child, props);

const defaultTransition = TransitionUtilities.getTransitionId("fade", "fade", "long");
const defaultTransitionDuration = TransitionUtilities.getDuration("long"); // Seconds

const RouteTransition: FunctionComponent<Props> = (props) => {
    const { transition, pageKey, osInstance, children } = props;

    const handleOnEntering = () => {
        // Hide page scrollbars when the animation is running
        osInstance?.options({
            overflowBehavior: {
                x: "hidden",
                y: "hidden"
            }
        });

        // Scroll the page to the top when when the page is entering
        osInstance?.scroll(0, 100);
    };

    const handleOnExited = () => {
        // Reset page scrollbar when animation is finished
        osInstance?.options({
            overflowBehavior: {
                x: "scroll",
                y: "scroll"
            }
        });
    };

    return (
        <TransitionGroup
            childFactory={childFactoryCreator({ 
                classNames: transition!, 
                timeout: defaultTransitionDuration * 1000
            })}
            className={classnames("RouteTransition", props.className)}
        >
            <CSSTransition
                key={pageKey}
                addEndListener={() => {}}
                onExited={handleOnExited}
                onEntering={handleOnEntering}
            >
                {children}
            </CSSTransition>
        </TransitionGroup>
    );
};

RouteTransition.defaultProps = {
    transition: defaultTransition
} as Partial<Props>;

export default RouteTransition;