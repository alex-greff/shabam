import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./ExpandIcon.scss";
import classnames from "classnames";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export interface Props extends BaseProps {
    expanded?: boolean;
    clickable?: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => unknown;
    size?: string | number;
};

const ExpandIcon: FunctionComponent<Props> = (props) => {
    const { onClick, clickable, expanded, size } = props;

    return (
        <div 
            className={classnames(
                "ExpandIcon", 
                props.className, 
                { expanded, clickable }
            )}
            onClick={(clickable) ? onClick : undefined}
        >
            <ExpandMoreIcon 
                className="ExpandIcon__icon"
                style={{
                    width: size,
                    height: size
                }}
            />
        </div>
    );
};

ExpandIcon.defaultProps = {
    expanded: false,
    clickable: false,
    size: "2rem"
} as Partial<Props>;

export default ExpandIcon;