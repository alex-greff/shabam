import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./PageContent.scss";
import classnames from "classnames";

export interface Props extends BaseProps {

};

const PageContent: FunctionComponent<Props> = (props) => {
    return (
        <div className={classnames("PageContent", props.className)}>
            {props.children}
        </div>
    );
};

PageContent.defaultProps = {

} as Partial<Props>;

export default PageContent;