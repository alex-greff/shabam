import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
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

    console.log(`pageKey: ${pageKey}, transition: ${transition}`);

    return (
        <TransitionGroup
            childFactory={childFactoryCreator({ 
                classNames: transition!, 
                timeout: duration! 
            })}
        >
            <CSSTransition
                key={pageKey}
                addEndListener={() => {}}
            >
                {children}
            </CSSTransition>
        </TransitionGroup>
    );
};

RouteTransition.defaultProps = {
    transition: "page",
    duration: 300,
} as Partial<Props>;

export default RouteTransition;