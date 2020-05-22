import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Benchmarks.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";

export interface Props extends BaseProps {

};

const Benchmarks: FunctionComponent<Props> = (props) => {
    return (
        <PageView 
            id="Benchmarks"
            className={classnames(props.className)}
        >
            Benchmarks View
        </PageView>
    );
};

Benchmarks.defaultProps = {

} as Partial<Props>;

export default Benchmarks;