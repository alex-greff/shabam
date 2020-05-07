import React, { FunctionComponent, useContext } from "react";
import { BaseProps } from "@/types"
import "./PageView.scss";
import classnames from "classnames";
import { NavBarHeightContext } from "@/contexts/NavBarHeightContext";

export interface Props extends BaseProps {
    id?: string;
}

const PageView: FunctionComponent<Props> = (props) => {
    const navbarHeight = useContext(NavBarHeightContext);

    return (
        <div 
            id={props.id}
            className={classnames("PageView", props.className)}
            style={{
                marginTop: `${navbarHeight}px`,
                minHeight: `calc(100vh - ${navbarHeight}px)`
            }}
        >
            {props.children}
        </div>
    );
};

export default PageView;