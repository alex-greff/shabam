import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./BenchmarkProgress.scss";
import classnames from "classnames";

export interface Props extends BaseProps {
  progress: number;
};

const BenchmarkProgress: FunctionComponent<Props> = (props) => {
  const { progress } = props;
  const progressNormalized = Math.round(progress * 100);

  return (
    <div 
      className={classnames("BenchmarkProgress", props.className)}
      style={props.style}
      id={props.id}
    >
      <div className="BenchmarkProgress__title">
        Running
      </div>
      <div className="BenchmarkProgress__percent">
        {progressNormalized}%
      </div>
    </div>
  );
};

BenchmarkProgress.defaultProps = {

} as Partial<Props>;

export default BenchmarkProgress;