import React, { FunctionComponent, useState, useEffect } from "react";
import { BaseProps } from "@/types"
import "./ConfigurationContainer.scss";
import classnames from "classnames";
import { CSSTransition } from "react-transition-group";

import ExpandIcon from "@/components/ui/icons/ExpandIcon/ExpandIcon";

export interface Props extends BaseProps {
    renderTitle?: () => React.ReactNode;
    collapsible?: boolean;
};

const ConfigurationContainer: FunctionComponent<Props> = (props) => {
    const { renderTitle, collapsible, ...rest } = props;

    const [open, setOpen] = useState(true);

    const handleExpandClick = () => {
        if (!collapsible) {
            return;
        }
        
        setOpen(!open);
    };

    useEffect(() => {
        if (!collapsible) {
            setOpen(true);
        }
    }, [collapsible])

    return (
        <div 
            className={classnames("ConfigurationContainer", props.className)}
            style={props.style}
            id={props.id}
        >
            <div className="ConfigurationContainer__header">
                <div className="ConfigurationContainer__title">
                    {(renderTitle) ? renderTitle() : null}
                </div>
                <div className="ConfigurationContainer__collapse-icon-container">
                    {(!collapsible) ? null : (
                        <ExpandIcon 
                            className="ConfigurationContainer__collapse-icon"
                            clickable={true}
                            size="2.5rem"
                            expanded={!open}
                            onClick={handleExpandClick}
                        /> 
                    )}
                </div>
            </div>
            <CSSTransition
                in={open}
                classNames="config-transition"
                timeout={0.3 * 1000}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <div className="ConfigurationContainer__content">
                    {props.children}
                </div>
            </CSSTransition>
        </div>
    );
};

ConfigurationContainer.defaultProps = {
    collapsible: true
} as Partial<Props>;

export default ConfigurationContainer;