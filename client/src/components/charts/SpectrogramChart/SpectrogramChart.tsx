import React, { FunctionComponent, useEffect, useRef } from "react";
import { BaseProps } from "@/types";
import "./SpectrogramChart.scss";
import classnames from "classnames";
import { renderSpectrogramChart } from "./SpectrogramChart.d3";
import { SpectrogramData } from "@/audio/types";
import { withSize, SizeMeProps } from "react-sizeme";

export interface Props extends BaseProps, SizeMeProps {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  spectrogramData: SpectrogramData;
}

// TODO: hook up to theme system
// const colorScalePallet = [
//   "rgba(0, 0, 0, 0)",
//   "rgba(230, 0, 0, 0.8)",
//   "rgba(255, 210, 0, 1)",
//   "rgba(255, 255, 255, 1)",
// ];

const colorScalePallet = [
  "rgba(0, 0, 0, 0)",
  "rgba(8, 79, 200, 0.8)",
  "rgba(0, 252, 239, 1)",
  "rgba(255, 255, 255, 1)",
];

const partitionDividerColors: [string, string] = [
  "rgba(80, 80, 80, 0.2)",
  "rgba(100, 100, 100, 0.2)"
];

const DISPLAY_PARTITION_DIVIDERS = true;

const SpectrogramChart: FunctionComponent<Props> = (props) => {
  const { spectrogramData, size, xAxisLabel, yAxisLabel, title } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  // Render the spectrogram
  useEffect(() => {
    if (size.width === 0 || size.height === 0)
      return;

    renderSpectrogramChart(
      containerRef.current!,
      spectrogramData,
      colorScalePallet,
      size.width || 0,
      size.height || 0,
      xAxisLabel,
      yAxisLabel,
      DISPLAY_PARTITION_DIVIDERS,
      partitionDividerColors
    );
  }, [containerRef, spectrogramData, size, xAxisLabel, yAxisLabel]);

  return (
    <div
      className={classnames("SpectrogramChart", props.className)}
      style={props.style}
      id={props.id}
    >
      {(title) ? <div className="SpectrogramChart__title">{title}</div> : null}
      
      <div className="SpectrogramChart__container" ref={containerRef}></div>
    </div>
  );
};

SpectrogramChart.defaultProps = {} as Partial<Props>;

export default withSize({
  monitorWidth: true,
  monitorHeight: true,
  refreshRate: 500,
})(SpectrogramChart);
