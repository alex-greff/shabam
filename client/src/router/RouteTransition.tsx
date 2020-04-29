import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types/baseProps.ts"
import classnames from "classnames";
import { TransitionGroup, CSSTransition } from 'react-transition-group';


export interface Props extends BaseProps {
    transition?: string;
    duration?: number;
    pageKey?: string;
};

interface FactoryProps {
    classNames: string;
    timeout: number;
}

const childFactoryCreator = (props: FactoryProps) => (child:any) => React.cloneElement(child, props);


const RouteTransition: FunctionComponent<Props> = (props) => {
    const { transition, duration, pageKey, children } = props;

    return (
        // <TransitionGroup
        //     childFactory={childFactoryCreator({ classNames: transition!, timeout: duration! })}
        // >
        //     <CSSTransition 
        //         key={pageKey} addEndListener={() => {}}
        //         // classNames={transition}
        //         // timeout={duration}
        //         // mountOnEnter={true}
        //         // unmountOnExit={true}
        //     >
        //         <div>{children}</div>
        //     </CSSTransition>
        // </TransitionGroup>
        <TransitionGroup
            childFactory={childFactoryCreator({ 
                classNames: props.transition!, 
                timeout: props.duration! 
            })}
        >
            <CSSTransition
                key={props.pageKey}
                addEndListener={() => {}}
            >
                {props.children}
            </CSSTransition>
        </TransitionGroup>
    );
};

RouteTransition.defaultProps = {
    transition: "page",
    duration: 300,
} as Partial<Props>;

export default RouteTransition;