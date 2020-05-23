import React, { FunctionComponent, MouseEvent } from "react";
import { BaseProps, AppRouteComponentProps, AppLocationState } from "@/types"
import "./ButtonBase.scss";
import classnames from "classnames";
import { Link, withRouter } from "react-router-dom";
import { LocationDescriptor } from "history";
import { Duration } from "@/utilities/transitionUtilities";

export interface Props extends BaseProps {
    path?: string;
    transitionId?: string;
    transitionDuration?: Duration;
    href?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement> 
        | React.MouseEvent<HTMLAnchorElement>
        | React.MouseEvent<HTMLAnchorElement>) => any;
    disabled?: boolean;
};

const ButtonBase: FunctionComponent<Props & AppRouteComponentProps> = (props) => {
    const { path, transitionId, transitionDuration, href, className, disabled, onClick, staticContext, ...rest } = props;

    const classNameComputed = classnames("ButtonBase", className, { "disabled": disabled });

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (disabled) {
            event.preventDefault();
            return;
        }

        if (onClick) onClick(event);
    };

    if (path) {
        const to: LocationDescriptor<AppLocationState> = {
            pathname: path,
            state: {
                transitionId,
                transitionDuration,
                prevPathname: props.location.pathname
            }
        };

        return (
            <Link 
                {...rest}
                to={to}
                className={classNameComputed}
                onClick={onClick}
            >
                {props.children}
            </Link>
        );
    }

    if (href) {
        return (
            <a
                {...rest}
                className={classNameComputed}
                onClick={onClick}
            >
                {props.children}
            </a>
        );
    }

    return (
        <button
            {...rest}
            className={classNameComputed}
            onClick={handleClick}
        >
            {props.children}
        </button>
    );
};

ButtonBase.defaultProps = {
    disabled: false
} as Partial<Props>;

export default withRouter(ButtonBase);