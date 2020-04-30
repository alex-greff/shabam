import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import { TransitionGroup, CSSTransition } from 'react-transition-group';


export interface Props extends BaseProps {
    transition?: string;
    pageKey?: string;
};

interface FactoryProps {
    classNames: string;
    timeout: number;
}

const childFactoryCreator = (props: FactoryProps) => (child:any) => React.cloneElement(child, props);


const RouteTransition: FunctionComponent<Props> = (props) => {
    const { transition, pageKey, children } = props;

    return (
        <TransitionGroup
            childFactory={childFactoryCreator({ 
                classNames: transition!, 
                timeout: 300
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
    transition: "page"
} as Partial<Props>;

export default RouteTransition;