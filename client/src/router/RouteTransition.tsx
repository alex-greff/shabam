import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classnames from "classnames";
import OverlayScrollbars from "overlayscrollbars";


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


const RouteTransition: FunctionComponent<Props> = (props) => {
    const { transition, pageKey, osInstance, children } = props;

    const handleOnEntering = () => {
        // Hide page scrollbars (and scroll to top) when the animation is running
        osInstance?.scroll(0);
        osInstance?.options({
            overflowBehavior: {
                x: "hidden",
                y: "hidden"
            }
        });
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
                timeout: 300
            })}
            className={classnames("RouteTransition", props.className)}
        >
            <CSSTransition
                key={pageKey}
                addEndListener={() => {}}
                onEntering={handleOnEntering}
                onExited={handleOnExited}
            >
                {children}
            </CSSTransition>
        </TransitionGroup>
    );
};

RouteTransition.defaultProps = {
    transition: "page"
} as Partial<Props>;

export default RouteTransition;