// Renders the D3 fingerprint chart

import { Fingerprint } from "@/audio/types";
import {
  CanvasRenderFunction,
  renderChart,
} from "@/components/charts/CanvasChartBase.d3";
import { FingerprintChartAuxData } from "./types";
import {
  renderCanvas,
  getAxisScales,
} from "@/components/charts/FingerprintChart/FingerprintChart.renderer";
import * as Comlink from "comlink";

// Setup worker used for rendering fingerprint charts
const worker = new Worker(
  "@/workers/canvas/RenderFingerprintCanvas.worker.ts",
  { name: "fingerprint-chart-worker", type: "module" }
);

const workerApi = Comlink.wrap<
  import("@/workers/canvas/RenderFingerprintCanvas.worker").RenderFingerprintCanvasWorker
>(worker);

/**
 * Renders a fingerprint chart into `containerElem`.
 *
 * @param containerElem The container to render into.
 * @param fingerprintData The fingerprint data.
 * @param selectionColor The color of each selection point.
 * @param outerWidth The outer width of the container.
 * @param outerHeight The outer height of the container
 * @param xAxisLabel The x-axis label.
 * @param yAxisLabel The y-axis label.
 */
export function renderFingerprintChart(
  containerElem: HTMLDivElement,
  fingerprintData: Fingerprint,
  selectionColor: string,
  outerWidth: number,
  outerHeight: number,
  xAxisLabel?: string,
  yAxisLabel?: string,
  renderPartitionDividers = false,
  partitionDividerColors?: [string, string]
) {
  // Wrap workerApi.renderCanvas so that the canvas value is transferred
  // before calling the worker
  const offlineCanvasRenderFunc: CanvasRenderFunction<
    Fingerprint,
    FingerprintChartAuxData
  > = (canvas, ...rest) => {
    const canvasTransferred = Comlink.transfer(canvas, [
      canvas as OffscreenCanvas,
    ]);
    workerApi.renderCanvas(canvasTransferred, ...rest);
  };

  const auxData: FingerprintChartAuxData = {
    selectionColor,
    renderPartitionDividers,
    partitionDividerColors,
  };

  renderChart<Fingerprint, number, FingerprintChartAuxData>(
    "FingerprintChart",
    containerElem,
    fingerprintData,
    outerWidth,
    outerHeight,
    auxData,
    {
      offlineCanvasRenderFunc: offlineCanvasRenderFunc,
      fallbackCanvasRenderFunc: renderCanvas,
    },
    getAxisScales,
    xAxisLabel,
    yAxisLabel
  );
}
