import React, { FunctionComponent, useEffect, useRef } from "react";
import { BaseProps } from "@/types";
import "./SpectrogramChart.scss";
import classnames from "classnames";
import { renderSpectrogramChart } from "./SpectrogramChart.d3";
import { SpectrogramData } from "@/audio/types";
import { withSize, SizeMeProps } from "react-sizeme";
import { DEFAULT_NAMESPACE } from "@/constants";
import { useNamespace, useThemeLink } from "@/themer-react";

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

  const themeData = useNamespace(DEFAULT_NAMESPACE)!;

  // Color scale pallet colors theme link hooks
  const csp_1 = useThemeLink(
    themeData,
    "SpectrogramChart",
    "color_scale",
    "color_1",
    0
  )!;
  const csp_2 = useThemeLink(
    themeData,
    "SpectrogramChart",
    "color_scale",
    "color_2",
    0.8
  )!;
  const csp_3 = useThemeLink(
    themeData,
    "SpectrogramChart",
    "color_scale",
    "color_3",
    1
  )!;
  const csp_4 = useThemeLink(
    themeData,
    "SpectrogramChart",
    "color_scale",
    "color_4",
    1
  )!;

  // Partition divider color theme link hooks
  const pdc_1 = useThemeLink(
    themeData,
    "SpectrogramChart",
    "partition_dividers",
    "color_1",
    0.2
  )!;
  const pdc_2 = useThemeLink(
    themeData,
    "SpectrogramChart",
    "partition_dividers",
    "color_2",
    0.2
  )!;

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
