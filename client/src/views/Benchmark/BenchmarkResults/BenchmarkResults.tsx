import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./BenchmarkResults.scss";
import classnames from "classnames";

import SpectrogramChart from "@/components/charts/SpectrogramChart/SpectrogramChart";
import { SpectrogramData } from "@/audio/types";

export interface Props extends BaseProps {
  spectrogramData: SpectrogramData;
};

const BenchmarkResults: FunctionComponent<Props> = (props) => {
  return (
    <div 
      className={classnames("BenchmarkResults", props.className)}
      style={props.style}
      id={props.id}
    >
      Benchmark Results
      
      {/* TODO: complete */}

      <SpectrogramChart 
        spectrogramData={props.spectrogramData}
      /> 
    </div>
  );
};

BenchmarkResults.defaultProps = {

} as Partial<Props>;

export default BenchmarkResults;