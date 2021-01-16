import React, { FunctionComponent, useEffect, useRef } from "react";
import { BaseProps } from "@/types";
import "./FingerprintChart.scss";
import classnames from "classnames";
import { Fingerprint } from "@/audio/types";
import { renderFingerprintChart } from "./FingerprintChart.d3";
import { withSize, SizeMeProps } from "react-sizeme";
import { useColorLink } from "@/hooks/useColorLink";

export interface Props extends BaseProps, SizeMeProps {
  title?: string;
  fingerprintData: Fingerprint;
}

const X_AXIS_LABEL = "Window";
const Y_AXIS_LABEL = "Frequency Band";

const DISPLAY_PARTITION_DIVIDERS = true;

const FingerprintChart: FunctionComponent<Props> = (props) => {
  const { title, fingerprintData, size } = props;
  const containerRef = useRef<HTMLDivElement>(null);

  // Selection color theme link hook
  const sc = useColorLink("fingerprint-chart-selection").toString();

  // Partition divider color theme link hooks
  const pdc_1 = useColorLink("chart-partition-divider-1", 0.2).toString();
  const pdc_2 = useColorLink("chart-partition-divider-2", 0.2).toString();

  // Render the fingerprint chart
  useEffect(() => {
    if (size.width === 0 || size.height === 0) return;

    renderFingerprintChart(
      containerRef.current!,
      fingerprintData,
      sc,
      size.width || 0,
      size.height || 0,
      X_AXIS_LABEL,
      Y_AXIS_LABEL,
      DISPLAY_PARTITION_DIVIDERS,
      [pdc_1, pdc_2]
    );
  }, [
    containerRef,
    fingerprintData,
    size.width,
    size.height,
    sc,
    pdc_1,
    pdc_2,
  ]);

  return (
    <div
      className={classnames("FingerprintChart", props.className)}
      style={props.style}
      id={props.id}
    >
      {title ? <div className="FingerprintChart__title">{title}</div> : null}

      <div className="FingerprintChart__container" ref={containerRef}></div>
    </div>
  );
};

FingerprintChart.defaultProps = {} as Partial<Props>;

export default withSize({
  monitorWidth: true,
  monitorHeight: true,
  refreshRate: 500,
})(FingerprintChart);
