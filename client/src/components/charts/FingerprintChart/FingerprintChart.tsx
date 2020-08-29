import React, { FunctionComponent, useEffect, useRef } from "react";
import { BaseProps } from "@/types";
import "./FingerprintChart.scss";
import classnames from "classnames";
import { Fingerprint } from "@/audio/types";
import { renderFingerprintChart } from "./FingerprintChart.d3";
import { withSize, SizeMeProps } from "react-sizeme";

export interface Props extends BaseProps, SizeMeProps {
  title?: string;
  fingerprintData: Fingerprint;
};

const X_AXIS_LABEL = "Window";
const Y_AXIS_LABEL = "Frequency Band";

// TODO: hook up to theme system
const selectionColor = "#08B4F4";

const FingerprintChart: FunctionComponent<Props> = (props) => {
  const { title, fingerprintData, size } = props;
  const containerRef = useRef<HTMLDivElement>(null);

  // Render the fingerprint chart
  useEffect(() => {
    if (size.width === 0 || size.height === 0)
      return;

    renderFingerprintChart(
      containerRef.current!,
      fingerprintData,
      selectionColor,
      size.width || 0,
      size.height || 0,
      X_AXIS_LABEL,
      Y_AXIS_LABEL
    );
  }, [containerRef, fingerprintData, size]);

  return (
    <div 
      className={classnames("FingerprintChart", props.className)}
      style={props.style}
      id={props.id}
    >
      {(title) ? <div className="FingerprintChart__title">{title}</div> : null}
      
      <div className="FingerprintChart__container" ref={containerRef}></div>
    </div>
  );
};

FingerprintChart.defaultProps = {

} as Partial<Props>;

export default withSize({
  monitorWidth: true,
  monitorHeight: true,
  refreshRate: 500
})(FingerprintChart);