import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Benchmark.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";
import PageContent from "@/components/page/PageContent/PageContent";
import ConfigurationContainer from "@/components/containers/ConfigurationContainer/ConfigurationContainer";
import DividerLine from "@/components/ui/dividers/DividerLine/DividerLine";

import NormalButton from "@/components/ui/buttons/NormalButton/NormalButton";
import IconButton from "@/components/ui/buttons/IconButton/IconButton";

import UploadIcon from "@material-ui/icons/CloudUpload";

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
                    contentClassName="Benchmark__config-content-container"
                    renderTitle={renderTitle}
                >
                    <div className="Benchmark__config-controls">
                        <div className="Benchmark__record-controls-container">
                            <div className="Benchmark__record-controls-title">
                                Record Audio
                            </div>

                            <div className="Benchmark__record-controls">
                                O X
                            </div>
                        </div>

                        <DividerLine 
                            className="Benchmark__divider"
                            orientation="vertical"
                        >
                            OR
                        </DividerLine>

                        <div className="Benchmark__file-controls-container">
                            <div className="Benchmark__file-controls-title">
                                Upload File    
                            </div>

                            <IconButton 
                                className="Benchmark__file-upload-button"
                                appearance="solid"
                                mode="info"
                                renderIcon={() => <UploadIcon />}
                            >
                                Audio File
                            </IconButton>
                        </div>
                    </div>

                    <NormalButton
                        className="Benchmark__run-benchmark-button"
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