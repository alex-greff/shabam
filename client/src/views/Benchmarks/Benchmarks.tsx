import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Benchmarks.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";
import PageContent from "@/components/page/PageContent/PageContent";
import ConfigurationContainer from "@/components/containers/ConfigurationContainer/ConfigurationContainer";

export interface Props extends BaseProps {

};

const Benchmarks: FunctionComponent<Props> = (props) => {
    const renderTitle = () => (
        <div className="Benchmarks__title">
            Fingerprinting Benchmark 
        </div>
    );

    return (
        <PageView 
            id="Benchmarks"
            className={classnames(props.className)}
        >
            <PageContent
                className="Benchmarks__content"
            >
                <ConfigurationContainer
                    renderTitle={renderTitle}
                >
                    Hey
                </ConfigurationContainer>

                More stuff
            </PageContent>
        </PageView>
    );
};

Benchmarks.defaultProps = {

} as Partial<Props>;

export default Benchmarks;