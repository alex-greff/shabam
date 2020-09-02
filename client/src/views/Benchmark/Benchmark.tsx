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

import BenchmarkConfiguration from "@/views/Benchmark/BenchmarkConfiguration/BenchmarkConfiguration";
import BenchmarkProgress from "@/views/Benchmark/BenchmarkProgress/BenchmarkProgress";
import BenchmarkResults from "@/views/Benchmark/BenchmarkResults/BenchmarkResults";

export interface Props extends Omit<BaseProps, "id"> {}

type AudioBlobSource = "recording" | "file" | null;

export interface BenchmarkResult {
  iterative: number;
  functional: number;
  wasm: number;
}

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

  const [numIterations, setNumIterations] = useState<number>(5); // TODO: hook up to BenchmarkConfiguration
  const [progress, setProgress] = useState<number>(0);
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>(
    []
  );

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
    } catch (err) {}

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
    } catch (err) {}

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
    } catch (err) {}

    return null;
  };

  const runBenchmark = async () => {
    // Reset data
    setBenchmarkIsRunning(true);
    setBenchmarkComplete(false);
    setBenchmarkSpectrogramData(null);
    setFingerprintResults(null);
    setProgress(0);

    console.log("Audio Blob", audioBlob); // TODO: remove

    if (audioBlob == null) {
      NotificationManager.showErrorNotification("Unable to load audio.");
      setBenchmarkIsRunning(false);
      return;
    }

    const audioBuffer = await AudioUtilities.convertBlobToAudioBuffer(
      audioBlob!
    );

    const spectrogramData = await AudioUtilities.computeSpectrogramData(
      audioBuffer
    );

    console.log("Spectrogram data:", spectrogramData); // TODO: remove

    const benchmarkResults: BenchmarkResult[] = [];

    let jobsCompleted = 0;

    // Run each iteration
    for (let i = 0; i < numIterations; i++) {
      const iterStart = performance.now();
      const iterFp = await runIterativeFingerprint(spectrogramData);
      const iterEnd = performance.now();
      const iterTime = iterEnd - iterStart;

      jobsCompleted++;
      setProgress((jobsCompleted / numIterations) * 3);

      const funcStart = performance.now();
      const funcFp = await runFunctionalFingerprint(spectrogramData);
      const funcEnd = performance.now();
      const funcTime = funcEnd - funcStart;

      jobsCompleted++;
      setProgress((jobsCompleted / numIterations) * 3);

      const wasmStart = performance.now();
      const wasmFp = await runWasmFingerprint(spectrogramData);
      const wasmEnd = performance.now();
      const wasmTime = wasmEnd - wasmStart;

      jobsCompleted++;
      setProgress((jobsCompleted / numIterations) * 3);

      // Only record the fingerprint data from the first iteration
      if (i === 0) {
        console.log("iterative fingerprint:", iterFp, iterTime); // TODO: remove
        console.log("functional fingerprint:", funcFp, funcTime); // TODO: remove
        console.log("WASM fingerprint:", wasmFp, wasmTime); // TODO: remove

        setFingerprintResults({
          iterativeFingerprint: iterFp!,
          functionalFingerprint: funcFp!,
          wasmFingerprint: wasmFp!,
        });
      }

      // TODO: make sure all fingerprints ran

      // Record the benchmark result
      benchmarkResults.push({
        iterative: iterTime,
        functional: funcTime,
        wasm: wasmTime,
      });
    }

    console.log("Benchmark results", benchmarkResults); // TODO: remove

    // Update state to indicate benchmark is complete
    setBenchmarkResults(benchmarkResults);
    setBenchmarkSpectrogramData(spectrogramData);
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
        <BenchmarkConfiguration 
          className="Benchmark__config-container"
          isRecording={isRecording}
          benchmarkIsRunning={benchmarkIsRunning}
          hasAudioBlob={hasAudioBlob}
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
          handleAudioFileChange={handleAudioFileChange}
          runBenchmark={runBenchmark}
        />

        {benchmarkIsRunning && !benchmarkComplete ? (
          <BenchmarkProgress
            className="Benchmark__progress"
            progress={progress}
          />
        ) : null}

        {benchmarkComplete && !benchmarkIsRunning ? (
          <BenchmarkResults
            className="Benchmark__results"
            spectrogramData={benchmarkSpectrogramData!}
            fingerprintResults={fingerprintResults!}
            benchmarkResults={benchmarkResults}
          />
        ) : null}
      </PageContent>
    </PageView>
  );
};

Benchmark.defaultProps = {} as Partial<Props>;

export default Benchmark;
