import React, { FunctionComponent, MouseEvent } from "react";
import { BaseProps } from "@/types"
import "./ButtonBase.scss";
import classnames from "classnames";
import { Link, LinkProps } from "react-router-dom";

export interface Props extends BaseProps, Partial<Pick<LinkProps, "to">> {
    href?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => any;
    disabled?: boolean;
};

const ButtonBase: FunctionComponent<Props> = (props) => {
    const { to, href, className, disabled, onClick, ...rest } = props;

    const classNameComputed = classnames("ButtonBase", className, { "disabled": disabled });

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (disabled) {
            event.preventDefault();
            return;
        }

        if (onClick) onClick(event);
    };

    if (to) {
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

export default ButtonBase;