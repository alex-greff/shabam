import React, { FunctionComponent, useContext } from "react";
import { BaseProps } from "@/types"
import "./PageAlignment.scss";
import classnames from "classnames";
import { NavBarHeightContext } from "@/contexts/NavBarHeightContext";

export interface Props extends BaseProps {
    id?: string;
}

const PageAlignment: FunctionComponent<Props> = (props) => {
    const navbarHeight = useContext(NavBarHeightContext);

    return (
        <div 
            id={props.id}
            className={classnames("PageAlignment", props.className)}
            style={{
                marginTop: `${navbarHeight}px`,
                minHeight: `calc(100vh - ${navbarHeight}px)`
            }}
        >
            {props.children}
        </div>
    );
};

export default PageAlignment;