import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./BenchmarkConfiguration.scss";
import classnames from "classnames";

import ConfigurationContainer from "@/components/containers/ConfigurationContainer/ConfigurationContainer";
import DividerLine from "@/components/ui/dividers/DividerLine/DividerLine";

import NormalButton from "@/components/ui/buttons/NormalButton/NormalButton";
import IconButton from "@/components/ui/buttons/IconButton/IconButton";
import RecordButton from "@/components/ui/buttons/RecordButton/RecordButton";
import StopRecordButton from "@/components/ui/buttons/StopRecordButton/StopRecordButton";
import FileUploadButtonWrapper from "@/components/ui/buttons/FileUploadButtonWrapper/FileUploadButtonWrapper";
import UploadIcon from "@material-ui/icons/CloudUpload";
import NumberInput from "@/components/ui/forms/input/NumberInput/NumberInput";

export interface Props extends BaseProps {
  isRecording: boolean;
  benchmarkIsRunning: boolean;
  hasAudioBlob: boolean;
  handleStartRecording: () => Promise<void>;
  handleStopRecording: () => Promise<void>;
  handleAudioFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  runBenchmark: () => Promise<void>;
  numIterations: number;
  setNumIterations: (n: number) => unknown;
}

const BenchmarkConfiguration: FunctionComponent<Props> = (props) => {
  const {
    isRecording,
    benchmarkIsRunning,
    hasAudioBlob,
    handleStartRecording,
    handleStopRecording,
    handleAudioFileChange,
    runBenchmark,
    numIterations,
    setNumIterations,
  } = props;

  const onIterationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value !== "" ? parseInt(e.target.value) : 0;
    setNumIterations(value);
  };

  return (
    <ConfigurationContainer
      className={classnames("BenchmarkConfiguration", props.className)}
      contentClassName="BenchmarkConfiguration__content-container"
      renderTitle={() => (
        <div className="BenchmarkConfiguration__title">
          Fingerprinting Benchmark
        </div>
      )}
    >
      <div className="BenchmarkConfiguration__config-controls">
        <div className="BenchmarkConfiguration__record-controls-container">
          <div className="BenchmarkConfiguration__record-controls-title">
            Record Audio
          </div>

          <div className="BenchmarkConfiguration__record-controls">
            <RecordButton
              className="BenchmarkConfiguration__record-button"
              size="3.6rem"
              stroke={40}
              disabled={isRecording || benchmarkIsRunning}
              onClick={handleStartRecording}
            />

            <StopRecordButton
              className="BenchmarkConfiguration__stop-record-button"
              size="3.6rem"
              stroke={40}
              disabled={!isRecording || benchmarkIsRunning}
              onClick={handleStopRecording}
            />
          </div>
        </div>

        <DividerLine
          className="BenchmarkConfiguration__divider"
          orientation="vertical"
        >
          OR
        </DividerLine>

        <div className="BenchmarkConfiguration__file-controls-container">
          <div className="BenchmarkConfiguration__file-controls-title">
            Upload File
          </div>

          <FileUploadButtonWrapper
            className="BenchmarkConfiguration__file-upload-button"
            accept="audio/*"
            onChange={handleAudioFileChange}
            disabled={isRecording || benchmarkIsRunning}
            renderContent={({ disabled }) => (
              <IconButton
                className="BenchmarkConfiguration__file-upload-button-content"
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

      <NumberInput
        className="BenchmarkConfiguration__iteration-input"
        defaultValue={numIterations}
        onInput={onIterationInputChange}
      />

      <NormalButton
        className="BenchmarkConfiguration__run-benchmark-button"
        appearance="solid"
        mode="success"
        disabled={!hasAudioBlob || benchmarkIsRunning}
        onClick={runBenchmark}
      >
        Run Benchmark
      </NormalButton>
    </ConfigurationContainer>
  );
};

BenchmarkConfiguration.defaultProps = {} as Partial<Props>;

export default BenchmarkConfiguration;
