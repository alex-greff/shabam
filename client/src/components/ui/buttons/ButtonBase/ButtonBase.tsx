import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./ButtonBase.scss";
import classnames from "classnames";
import { useTransitionHistory } from 'react-route-transition';

export interface Props extends BaseProps {
    path?: string;
    href?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement> 
        | React.MouseEvent<HTMLAnchorElement>
        | React.MouseEvent<HTMLAnchorElement>
        | React.MouseEvent<HTMLDivElement>) => any;
    disabled?: boolean;
    // For if the button ever gets put into a FileUploadWrapper
    forceDiv?: boolean;
};

const ButtonBase: FunctionComponent<Props> = (props) => {
    const { 
        path,
        href, 
        className, 
        disabled, 
        onClick, 
        forceDiv,
        ...rest 
    } = props;

    const history = useTransitionHistory();

    const classNameComputed = classnames("ButtonBase", className, { "disabled": disabled });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>) => {
        if (disabled) {
            event.preventDefault();
            return;
        }

        if (onClick) onClick(event);
    };

    if (forceDiv) {
        return (
            <div
                {...rest}
                className={classNameComputed}
                onClick={handleClick}
            >
                {props.children}
            </div>
        )
    }

    if (path) {
        const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (disabled) return;

            history.push(path);
            if (onClick) onClick(e);
        }

        return (
            <a 
                {...rest}
                href={path}
                className={classNameComputed}
                onClick={handleLinkClick}
            >
                {props.children}
            </a>
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
    disabled: false,
    forceDiv: false
} as Partial<Props>;

export default ButtonBase;