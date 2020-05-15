import React, { FunctionComponent } from "react";
import { BaseProps, AppRouteComponentProps } from "@/types"
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classnames from "classnames";
import OverlayScrollbars from "overlayscrollbars";
import * as TransitionUtilities from "@/utilities/transitionUtilities";
import { withRouter } from "react-router-dom";

export interface Props extends BaseProps {
    transitionId?: string;
    transitionDuration?: TransitionUtilities.Duration
    pageKey?: string;
    osInstance?: OverlayScrollbars | null;
};

interface FactoryProps {
    classNames: string;
    timeout: number;
}

const childFactoryCreator = (props: FactoryProps) => (child:any) => React.cloneElement(child, props);

const RouteTransition: FunctionComponent<Props & AppRouteComponentProps> = (props) => {
    const { 
        transitionId: transitionIdOverride, 
        transitionDuration: transitionDurationOverride, 
        pageKey, 
        osInstance, 
        children 
    } = props;

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

    // TLDR: use the transitions assigned to each page transitions 
    // unless a specific override transition is supplied as a prop
    const defaultDuration: TransitionUtilities.Duration = (transitionIdOverride && transitionDurationOverride) ? transitionDurationOverride : "medium";
    const currView = TransitionUtilities.matchPathnameToView(props.location.pathname);
    const prevView = TransitionUtilities.matchPathnameToView(props.location.state?.prevPathname);
    const transitionId = (transitionIdOverride) ? transitionIdOverride : TransitionUtilities.getViewTransitionId(prevView, currView);
    const transitionDurationNum = (transitionIdOverride) ? TransitionUtilities.getDuration(defaultDuration) : TransitionUtilities.getViewTransitionDuration(prevView, currView);

    return (
        <TransitionGroup
            childFactory={childFactoryCreator({ 
                classNames: transitionId!, 
                timeout: transitionDurationNum * 1000
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

} as Partial<Props>;

export default withRouter(RouteTransition);