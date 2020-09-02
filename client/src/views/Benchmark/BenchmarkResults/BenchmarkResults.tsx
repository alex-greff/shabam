import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./BenchmarkResults.scss";
import classnames from "classnames";
import { SpectrogramData } from "@/audio/types";
import { FingerprintResults, BenchmarkResult } from "../Benchmark";

import SpectrogramChart from "@/components/charts/SpectrogramChart/SpectrogramChart";
import FingerprintChart from "@/components/charts/FingerprintChart/FingerprintChart";

export interface Props extends BaseProps {
  spectrogramData: SpectrogramData;
  fingerprintResults: FingerprintResults;
  benchmarkResults: BenchmarkResult[];
};

const BenchmarkResults: FunctionComponent<Props> = (props) => {
  const { spectrogramData, fingerprintResults } = props;

  return (
    <div 
      className={classnames("BenchmarkResults", props.className)}
      style={props.style}
      id={props.id}
    >
      <div className="BenchmarkResults__title">
        Benchmark Results
      </div>
      
      {/* TODO: complete */}

      <SpectrogramChart 
        spectrogramData={spectrogramData}
        title="Audio Spectrogram"
        xAxisLabel="Window"
        yAxisLabel="Frequency Bin"
      /> 

      <FingerprintChart 
        fingerprintData={fingerprintResults.iterativeFingerprint}
        title="Iteratively Generated Fingerprint"
      />

      <FingerprintChart 
        fingerprintData={fingerprintResults.functionalFingerprint}
        title="Functionally Generated Fingerprint"
      />

      <FingerprintChart 
        fingerprintData={fingerprintResults.wasmFingerprint}
        title="WASM Generated Fingerprint"
      />
    </div>
  );
};

BenchmarkResults.defaultProps = {

} as Partial<Props>;

export default BenchmarkResults;