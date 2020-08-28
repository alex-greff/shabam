import React, { FunctionComponent, useEffect, useRef } from "react";
import { BaseProps } from "@/types";
import "./SpectrogramChart.scss";
import classnames from "classnames";
import { renderSpectrogramChart } from "./SpectrogramChart.d3";
import { SpectrogramData } from "@/audio/types";

export interface Props extends BaseProps {
  spectrogramData: SpectrogramData;
}

const SpectrogramChart: FunctionComponent<Props> = (props) => {
  const { spectrogramData } = props;

  const rootRef = useRef<HTMLDivElement>(null);

  // Render the spectrogram
  useEffect(() => {
    renderSpectrogramChart(rootRef.current!, spectrogramData);
  }, [rootRef, spectrogramData]);

  return (
    <div
      className={classnames("SpectrogramChart", props.className)}
      style={props.style}
      id={props.id}
      ref={rootRef}
    ></div>
  );
};

SpectrogramChart.defaultProps = {} as Partial<Props>;

export default SpectrogramChart;
