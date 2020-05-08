import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./ExpandIcon.scss";
import classnames from "classnames";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export interface Props extends BaseProps {
    expanded?: boolean;
};

const ExpandIcon: FunctionComponent<Props> = (props) => {
    const { expanded } = props;

    return (
        <div className={classnames("ExpandIcon", props.className, { expanded })}>
            <ExpandMoreIcon 
                className="ExpandIcon__icon"
            />
        </div>
    );
};

ExpandIcon.defaultProps = {
    expanded: false
} as Partial<Props>;

export default ExpandIcon;