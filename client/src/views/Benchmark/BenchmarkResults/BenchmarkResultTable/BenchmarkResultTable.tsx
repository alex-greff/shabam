import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./BenchmarkResultTable.scss";
import classnames from "classnames";
import { BenchmarkResult } from "../../Benchmark";

export interface Props extends BaseProps {
  benchmarkResults: BenchmarkResult[];
}

const renderIterationRow = (result: BenchmarkResult, iteration: number) => {
  const bgModifier = iteration % 2 === 0 ? "even" : "odd";

  return (
    <React.Fragment key={`iter-row-${iteration}`}>
      <div
        className={classnames(
          "BenchmarkResultTable__iteration-cell",
          "BenchmarkResultTable__table-cell"
        )}
        style={{
          gridRow: `${iteration + 1} / span 1`,
        }}
      >
        {iteration}
      </div>

      <div
        className={classnames(
          "BenchmarkResultTable__itr-cell",
          "BenchmarkResultTable__table-cell",
          "BenchmarkResultTable__data-cell"
        )}
        style={{
          gridRow: `${iteration + 1} / span 1`,
        }}
      >
        {result.iterative.toFixed(2)} ms
      </div>

      <div
        className={classnames(
          "BenchmarkResultTable__func-cell",
          "BenchmarkResultTable__table-cell",
          "BenchmarkResultTable__data-cell"
        )}
        style={{
          gridRow: `${iteration + 1} / span 1`,
        }}
      >
        {result.functional.toFixed(2)} ms
      </div>

      <div
        className={classnames(
          "BenchmarkResultTable__wasm-cell",
          "BenchmarkResultTable__table-cell",
          "BenchmarkResultTable__data-cell"
        )}
        style={{
          gridRow: `${iteration + 1} / span 1`,
        }}
      >
        {result.wasm.toFixed(2)} ms
      </div>

      <div
        className={classnames("BenchmarkResultTable__row-bg", bgModifier)}
        style={{
          gridColumn: `1 / span 4`,
          gridRow: `${iteration + 1} / span 1`,
        }}
      ></div>
    </React.Fragment>
  );
};

const renderAverageRow = (results: BenchmarkResult[]) => {
  const length = results.length;
  const iteration = results.length + 1;
  const bgModifier = iteration % 2 === 0 ? "even" : "odd";

  const itrAvg = results.reduce((acc, r) => acc + r.iterative, 0) / length;
  const funcAvg = results.reduce((acc, r) => acc + r.functional, 0) / length;
  const wasmAvg = results.reduce((acc, r) => acc + r.wasm, 0) / length;

  return (
    <>
      <div
        className={classnames(
          "BenchmarkResultTable__iteration-cell",
          "BenchmarkResultTable__table-cell"
        )}
        style={{
          gridRow: `${iteration + 1} / span 1`,
        }}
      >
        Average
      </div>

      <div
        className={classnames(
          "BenchmarkResultTable__itr-cell",
          "BenchmarkResultTable__table-cell",
          "BenchmarkResultTable__data-cell",
          "BenchmarkResultTable__average-cell"
        )}
        style={{
          gridRow: `${iteration + 1} / span 1`,
        }}
      >
        {itrAvg.toFixed(2)} ms
      </div>

      <div
        className={classnames(
          "BenchmarkResultTable__func-cell",
          "BenchmarkResultTable__table-cell",
          "BenchmarkResultTable__data-cell",
          "BenchmarkResultTable__average-cell"
        )}
        style={{
          gridRow: `${iteration + 1} / span 1`,
        }}
      >
        {funcAvg.toFixed(2)} ms
      </div>

      <div
        className={classnames(
          "BenchmarkResultTable__wasm-cell",
          "BenchmarkResultTable__table-cell",
          "BenchmarkResultTable__data-cell",
          "BenchmarkResultTable__average-cell"
        )}
        style={{
          gridRow: `${iteration + 1} / span 1`,
        }}
      >
        {wasmAvg.toFixed(2)} ms
      </div>

      <div
        className={classnames("BenchmarkResultTable__row-bg", bgModifier)}
        style={{
          gridColumn: `1 / span 4`,
          gridRow: `${iteration + 1} / span 1`,
        }}
      ></div>
    </>
  );
};

const BenchmarkResultTable: FunctionComponent<Props> = (props) => {
  const { benchmarkResults } = props;

  return (
    <div
      className={classnames("BenchmarkResultTable", props.className)}
      style={props.style}
      id={props.id}
    >
      <div className="BenchmarkResultTable__table">
        <div
          className={classnames(
            "BenchmarkResultTable__iteration-header",
            "BenchmarkResultTable__header-cell"
          )}
        >
          Iteration
        </div>

        <div
          className={classnames(
            "BenchmarkResultTable__itr-header",
            "BenchmarkResultTable__header-cell"
          )}
        >
          Iterative
        </div>

        <div
          className={classnames(
            "BenchmarkResultTable__func-header",
            "BenchmarkResultTable__header-cell"
          )}
        >
          Functional
        </div>

        <div
          className={classnames(
            "BenchmarkResultTable__wasm-header",
            "BenchmarkResultTable__header-cell"
          )}
        >
          WebAssembly
        </div>

        {benchmarkResults.map((result, idx) =>
          renderIterationRow(result, idx + 1)
        )}

        {renderAverageRow(benchmarkResults)}
      </div>
    </div>
  );
};

BenchmarkResultTable.defaultProps = {} as Partial<Props>;

export default BenchmarkResultTable;
