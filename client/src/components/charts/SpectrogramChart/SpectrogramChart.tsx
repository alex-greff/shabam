import React, { FunctionComponent, useEffect, useRef } from "react";
import { BaseProps } from "@/types";
import "./SpectrogramChart.scss";
import classnames from "classnames";
import { renderSpectrogramChart } from "./SpectrogramChart.d3";
import { SpectrogramData } from "@/audio/types";
import { withSize, SizeMeProps } from "react-sizeme";
import { useColorLink } from "@/hooks/useColorLink";

export interface Props extends BaseProps, SizeMeProps {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  spectrogramData: SpectrogramData;
}

const DISPLAY_PARTITION_DIVIDERS = true;

const SpectrogramChart: FunctionComponent<Props> = (props) => {
  const { spectrogramData, size, xAxisLabel, yAxisLabel, title } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  // Color scale pallet colors theme link hooks
  const csp_1 = useColorLink("spectrogram-chart-color-scale-1", 0).toString();
  const csp_2 = useColorLink("spectrogram-chart-color-scale-2", 0.8).toString();
  const csp_3 = useColorLink("spectrogram-chart-color-scale-3", 1).toString();
  const csp_4 = useColorLink("spectrogram-chart-color-scale-4", 1).toString();

  // Partition divider color theme link hooks
  const pdc_1 = useColorLink("chart-partition-divider-1", 0.2).toString();
  const pdc_2 = useColorLink("chart-partition-divider-2", 0.2).toString();

  // Render the spectrogram
  useEffect(() => {
    if (size.width === 0 || size.height === 0) return;

    renderSpectrogramChart(
      containerRef.current!,
      spectrogramData,
      [csp_1, csp_2, csp_3, csp_4],
      size.width || 0,
      size.height || 0,
      xAxisLabel,
      yAxisLabel,
      DISPLAY_PARTITION_DIVIDERS,
      [pdc_1, pdc_2]
    );
  }, [
    containerRef,
    spectrogramData,
    size.width,
    size.height,
    xAxisLabel,
    yAxisLabel,
    csp_1,
    csp_2,
    csp_3,
    csp_4,
    pdc_1,
    pdc_2,
  ]);

  return (
    <div
      className={classnames("SpectrogramChart", props.className)}
      style={props.style}
      id={props.id}
    >
      {title ? <div className="SpectrogramChart__title">{title}</div> : null}

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
