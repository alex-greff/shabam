import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Benchmark.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";
import PageContent from "@/components/page/PageContent/PageContent";
import ConfigurationContainer from "@/components/containers/ConfigurationContainer/ConfigurationContainer";

import NormalButton from "@/components/ui/buttons/NormalButton/NormalButton";

export interface Props extends Omit<BaseProps, "id"> {

};

const Benchmark: FunctionComponent<Props> = (props) => {
    const renderTitle = () => (
        <div className="Benchmark__title">
            Fingerprinting Benchmark 
        </div>
    );

    return (
        <PageView 
            id="Benchmark"
            className={classnames(props.className)}
            style={props.style}
        >
            <PageContent
                className="Benchmark__content"
            >
                <ConfigurationContainer
                    className="Benchmark__config-container"
                    renderTitle={renderTitle}
                >
                    <NormalButton
                        appearance="solid"
                        mode="success"
                        // disabled
                    >
                        Run Benchmark
                    </NormalButton>
                </ConfigurationContainer>

                More stuff
            </PageContent>
        </PageView>
    );
};

Benchmark.defaultProps = {

} as Partial<Props>;

export default Benchmark;