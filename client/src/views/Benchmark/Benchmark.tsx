import React, { FunctionComponent, useState } from "react";
import { BaseProps } from "@/types";
import "./Benchmark.scss";
import classnames from "classnames";
import * as NotificationManager from "@/managers/NotificationManager";
import AudioRecorderFactory, { AudioRecorder } from "@/audio/recorder";
import * as AudioUtilities from "@/audio/utilities";
import { wrap } from "comlink";
import { SpectrogramData, Fingerprint } from "@/audio/types";

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

import BenchmarkResults from "@/views/Benchmark/BenchmarkResults/BenchmarkResults";

export interface Props extends Omit<BaseProps, "id"> {}

type AudioBlobSource = "recording" | "file" | null;

// TODO: might want to move out the worker interface instantiation to a
// different module

// Iterative fingerprint worker
const iterFpWorker = new Worker(
  "@/workers/fingerprint/IterativeFingerprint.worker.ts",
  { name: "iterative-fingerprint-worker", type: "module" }
);
const iterFpWorkerApi = wrap<
  import("@/workers/fingerprint/IterativeFingerprint.worker").IterativeFingerprintWorker
>(iterFpWorker);

// Functional fingerprint worker
const funcFpWorker = new Worker(
  "@/workers/fingerprint/FunctionalFingerprint.worker.ts",
  { name: "functional-fingerprint-worker", type: "module" }
);
const funcFpWorkerApi = wrap<
  import("@/workers/fingerprint/FunctionalFingerprint.worker").FunctionalFingerprintWorker
>(funcFpWorker);

// WebAssembly fingerprint worker
const wasmFpWorker = new Worker(
  "@/workers/fingerprint/WasmFingerprint.worker.ts",
  { name: "wasm-fingerprint-worker", type: "module" }
);
const wasmFpWorkerApi = wrap<
  import("@/workers/fingerprint/WasmFingerprint.worker").WasmFingerprintWorker
>(wasmFpWorker);

// TODO: add the rest of the fingerprints
export interface FingerprintResults {
  iterativeFingerprint: Fingerprint;
  functionalFingerprint: Fingerprint;
  wasmFingerprint: Fingerprint;
}

const Benchmark: FunctionComponent<Props> = (props) => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioBlobSource, setAudioBlobSource] = useState<AudioBlobSource>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioRecorder, setAudioRecorder] = useState<AudioRecorder | null>(
    null
  );

  const [benchmarkIsRunning, setBenchmarkIsRunning] = useState<boolean>(false);
  const [benchmarkComplete, setBenchmarkComplete] = useState<boolean>(false);
  const [
    benchmarkSpectrogramData,
    setBenchmarkSpectrogramData,
  ] = useState<SpectrogramData | null>(null);
  const [
    fingerprintResults,
    setFingerprintResults,
  ] = useState<FingerprintResults | null>(null);

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audioFile = e.target.files ? e.target.files[0] : null;
    setAudioBlob(audioFile);
    setAudioBlobSource("file");
  };

  const handleStartRecording = async () => {
    try {
      const audioRecorder = await AudioRecorderFactory.create();
      audioRecorder.start();
      setAudioRecorder(audioRecorder);
      setIsRecording(true);
    } catch (err) {
      NotificationManager.showErrorNotification("Unable to access microphone");
    }
  };

  const handleStopRecording = async () => {
    const audioBlob = await audioRecorder?.stop();
    setAudioRecorder(null);
    setIsRecording(false);
    setAudioBlob(audioBlob!);
    setAudioBlobSource("recording");
  };

  const runIterativeFingerprint = async (
    spectrogramData: SpectrogramData
  ): Promise<Fingerprint | null> => {
    try {
      const fingerprint = await iterFpWorkerApi.generateFingerprint(
        spectrogramData,
        {}
      );

      return fingerprint;
    } catch (err) {
      // TODO: handle error better?
      console.error(
        "Iterative Fingerprint Worker: unable to generate fingerprint",
        err
      );
    }

    return null;
  };

  const runFunctionalFingerprint = async (
    spectrogramData: SpectrogramData
  ): Promise<Fingerprint | null> => {
    try {
      const fingerprint = await funcFpWorkerApi.generateFingerprint(
        spectrogramData,
        {}
      );

      return fingerprint;
    } catch (err) {
      // TODO: handle error better?
      console.error(
        "Functional Fingerprint Worker: unable to generate fingerprint",
        err
      );
    }

    return null;
  };

  const runWasmFingerprint = async (
    spectrogramData: SpectrogramData
  ): Promise<Fingerprint | null> => {
    try {
      const fingerprint = await wasmFpWorkerApi.generateFingerprint(
        spectrogramData,
        {}
      );

      return fingerprint;
    } catch (err) {
      // TODO: handle error better?
      console.error("WASM Fingerprint Worker: unable to generate fingerprint");
    }

    return null;
  };

  const runBenchmark = async () => {
    setBenchmarkIsRunning(true);
    setBenchmarkComplete(false);

    console.log("Audio Blob", audioBlob); // TODO: remove

    if (audioBlob == null) {
      console.error("Audio blob is null");
    }

    const audioBuffer = await AudioUtilities.convertBlobToAudioBuffer(
      audioBlob!
    );

    const spectrogramData = await AudioUtilities.computeSpectrogramData(
      audioBuffer
    );

    console.log("Spectrogram data:", spectrogramData); // TODO: remove

    const iterativeFp = await runIterativeFingerprint(spectrogramData);
    const functionalFp = await runFunctionalFingerprint(spectrogramData);
    const wasmFp = await runWasmFingerprint(spectrogramData); // TODO: uncomment

    console.log("iterative fingerprint:", iterativeFp); // TODO: remove
    console.log("functional fingerprint:", functionalFp); // TODO: remove
    console.log("WASM fingerprint:", wasmFp); // TODO: remove

    // TODO: make sure all fingerprints run

    // Update state to indicate benchmark is complete
    setBenchmarkSpectrogramData(spectrogramData);
    setFingerprintResults({
      iterativeFingerprint: iterativeFp!,
      functionalFingerprint: functionalFp!,
      wasmFingerprint: wasmFp!
    });
    setBenchmarkIsRunning(false);
    setBenchmarkComplete(true);
  };

  const hasAudioBlob = !!audioBlob;

  return (
    <PageView
      id="Benchmark"
      className={classnames(props.className)}
      style={props.style}
    >
      <PageContent className="Benchmark__content">
        <ConfigurationContainer
          className="Benchmark__config-container"
          contentClassName="Benchmark__config-content-container"
          renderTitle={() => (
            <div className="Benchmark__title">Fingerprinting Benchmark</div>
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
                  disabled={isRecording || benchmarkIsRunning}
                  onClick={handleStartRecording}
                />

                <StopRecordButton
                  className="Benchmark__stop-record-button"
                  size="3.6rem"
                  stroke={40}
                  disabled={!isRecording || benchmarkIsRunning}
                  onClick={handleStopRecording}
                />
              </div>
            </div>

            <DividerLine className="Benchmark__divider" orientation="vertical">
              OR
            </DividerLine>

            <div className="Benchmark__file-controls-container">
              <div className="Benchmark__file-controls-title">Upload File</div>

              <FileUploadButtonWrapper
                className="Benchmark__file-upload-button"
                accept="audio/*"
                onChange={handleAudioFileChange}
                disabled={isRecording || benchmarkIsRunning}
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
            disabled={!hasAudioBlob || benchmarkIsRunning}
            onClick={runBenchmark}
          >
            Run Benchmark
          </NormalButton>
        </ConfigurationContainer>

        {benchmarkComplete && !benchmarkIsRunning ? (
          <BenchmarkResults
            spectrogramData={benchmarkSpectrogramData!}
            fingerprintResults={fingerprintResults!}
          />
        ) : null}
      </PageContent>
    </PageView>
  );
};

Benchmark.defaultProps = {} as Partial<Props>;

export default Benchmark;
