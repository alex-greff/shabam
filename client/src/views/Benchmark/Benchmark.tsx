import React, { FunctionComponent, useState } from "react";
import { BaseProps } from "@/types"
import "./Benchmark.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";
import PageContent from "@/components/page/PageContent/PageContent";
import ConfigurationContainer from "@/components/containers/ConfigurationContainer/ConfigurationContainer";
import DividerLine from "@/components/ui/dividers/DividerLine/DividerLine";

import NormalButton from "@/components/ui/buttons/NormalButton/NormalButton";
import IconButton from "@/components/ui/buttons/IconButton/IconButton";
import RecordButton from "@/components/ui/buttons/RecordButton/RecordButton";
import StopRecordButton from "@/components/ui/buttons/StopRecordButton/StopRecordButton";
import FileUploadButtonWrapper from "@/components/ui/buttons/FileUploadButtonWrapper/FileUploadButtonWrapper";

import UploadIcon from "@material-ui/icons/CloudUpload";

export interface Props extends Omit<BaseProps, "id"> {

};

type AudioBlobSource = "recording" | "file" | null;

const Benchmark: FunctionComponent<Props> = (props) => {
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioBlobSource, setAudioBlobSource] = useState<AudioBlobSource>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audioFile = (e.target.files) ? e.target.files[0] : null;
        setAudioBlob(audioFile);
        setAudioBlobSource("file");
    };

    const hasAudioBlob = !!audioBlob;

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
                    renderTitle={() => (
                        <div className="Benchmark__title">
                            Fingerprinting Benchmark 
                        </div>
                    )}
                >
                    <div className="Benchmark__config-controls">
                        <div className="Benchmark__record-controls-container">
                            <div className="Benchmark__record-controls-title">
                                Record Audio
                            </div>

                            <div className="Benchmark__record-controls">
                                <RecordButton 
                                    className="Benchmark__record-button"
                                    size="3.6rem"
                                    stroke={40}
                                    disabled={isRecording}
                                />

                                <StopRecordButton 
                                    className="Benchmark__stop-record-button"
                                    size="3.6rem"
                                    stroke={40}
                                    disabled={!isRecording}
                                />
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

                            <FileUploadButtonWrapper 
                                className="Benchmark__file-upload-button"
                                accept="audio/*"
                                onChange={handleAudioFileChange}
                                disabled={isRecording}

                                renderContent={({ disabled }) => (
                                    <IconButton 
                                        className="Benchmark__file-upload-button-content"
                                        appearance="solid"
                                        mode="info"
                                        renderIcon={() => <UploadIcon />}
                                        forceDiv
                                        disabled={disabled}
                                    >
                                        Audio File
                                    </IconButton>
                                )}
                            />
                        </div>
                    </div>

                    <NormalButton
                        className="Benchmark__run-benchmark-button"
                        appearance="solid"
                        mode="success"
                        disabled={!hasAudioBlob}
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