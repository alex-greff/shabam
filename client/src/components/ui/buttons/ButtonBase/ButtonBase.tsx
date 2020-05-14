import React, { FunctionComponent, MouseEvent } from "react";
import { BaseProps, AppRouteComponentProps, AppLocationState } from "@/types"
import "./ButtonBase.scss";
import classnames from "classnames";
import { Link, withRouter } from "react-router-dom";
import { LocationDescriptor } from "history";

export interface Props extends BaseProps {
    path?: string;
    transition?: string;
    href?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => any;
    disabled?: boolean;
};

const ButtonBase: FunctionComponent<Props & AppRouteComponentProps> = (props) => {
    const { path, transition, href, className, disabled, onClick, ...rest } = props;

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
                transition,
                prevPathname: props.location.pathname
            }
        };

        return (
            <Link 
                {...rest}
                to={to}
                className={classNameComputed}
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