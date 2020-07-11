import React, { FunctionComponent, useState } from "react";
import { BaseProps } from "@/types";
import "./Benchmark.scss";
import classnames from "classnames";
import * as NotificationManager from "@/managers/NotificationManager";
import AudioRecorderFactory, { AudioRecorder } from "@/audio/recorder";
import { wrap } from "comlink";

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

import { loadWasmModule, WasmModuleWrapper } from "@/loaders/WASMLoader";

// TODO: remove
// const testWorker = new Worker("@/workers/test.worker.ts", { type: "module" });

export interface Props extends Omit<BaseProps, "id"> {}

type AudioBlobSource = "recording" | "file" | null;

const Benchmark: FunctionComponent<Props> = (props) => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioBlobSource, setAudioBlobSource] = useState<AudioBlobSource>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioRecorder, setAudioRecorder] = useState<AudioRecorder | null>(
    null
  );
  const [benchmarkIsRunning, setBenchmarkIsRunning] = useState<boolean>(false);

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

  const runBenchmark = async () => {
    console.log("TODO: run benchmarks");

    // TODO: remove
    // testWorker.postMessage("Hello there");

    // testWorker.onmessage()

    // loadWasmModule("main");

    // const test = import("@WASM/main-wasm.js");
    // const test2 = import("@WASM/main-wasm.wasm");

    // loadWasmModule(import("@WASM/main-wasm.js"), import("@WASM/main-wasm.wasm"), (err, module) => {
    //     console.log("Error", err);
    //     console.log("Module", module);
    // });

    // const test = new WasmModuleWrapper(import("@WASM/main-wasm.js"), import("@WASM/main-wasm.wasm"));

    // try {
    //     await test.initialize();

    //     console.log("Module", test.module);
    // } catch(err) {
    //     console.error("Error", test.error);
    // }

    // const worker = new Worker("@/workers/test.worker.ts", { name: "test-worker", type: "module" });
    // const workerApi = wrap<import("@/workers/test.worker").TestWorker>(worker);
    // await workerApi.test();

    const wasmFpWorker = new Worker(
      "@/workers/fingerprint/WasmFingerprint.worker.ts",
      { name: "wasm-fingerprint-worker", type: "module" }
    );
    const wasmFpWorkerApi = wrap<
      import("@/workers/fingerprint/WasmFingerprint.worker").WasmFingerprintWorker
    >(wasmFpWorker);
    await wasmFpWorkerApi.generateFingerprint(
      { data: new Uint8Array(0), frequencyBinCount: 0, numberOfWindows: 0 },
      {}
    );
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
        More stuff
      </PageContent>
    </PageView>
  );
};

Benchmark.defaultProps = {} as Partial<Props>;

export default Benchmark;
