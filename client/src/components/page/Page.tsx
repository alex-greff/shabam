import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Page.scss";
import classnames from "classnames";

export interface Props extends BaseProps {
    id?: string;
    navbarHeight: number;
}

const Page: FunctionComponent<Props> = (props) => {
    return (
        <div 
            id={props.id}
            className={classnames("Page", props.className)}
            style={{
                paddingTop: `${props.navbarHeight}px`
            }}
        >
            {props.children}
        </div>
    );
};

export default Page;