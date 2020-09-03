// Renders the D3 spectrogram chart

import { SpectrogramData } from "@/audio/types";
import {
  CanvasRenderFunction,
  renderChart,
} from "@/components/charts/CanvasChartBase.d3";
import { SpectrogramChartAuxData } from "./types";
import {
  getAxisScales,
  renderCanvas,
} from "@/components/charts/SpectrogramChart/SpectrogramChart.renderer";
import * as Comlink from "comlink";

const worker = new Worker(
  "@/workers/canvas/RenderSpectrogramCanvas.worker.ts",
  { name: "spectrogram-chart-worker", type: "module" }
);

const workerApi = Comlink.wrap<
  import("@/workers/canvas/RenderSpectrogramCanvas.worker").RenderSpectrogramCanvasWorker
>(worker);

/**
 * Renders a spectrogram chart into `containerElem`.
 *
 * @param containerElem The container to render into.
 * @param spectrogramData The spectrogram data.
 * @param colorScalePallet The color scale pallet.
 * @param outerWidth The outer width of the container.
 * @param outerHeight The outer height of the container
 * @param xAxisLabel The x-axis label.
 * @param yAxisLabel The y-axis label.
 */
export function renderSpectrogramChart(
  containerElem: HTMLDivElement,
  spectrogramData: SpectrogramData,
  colorScalePallet: string[],
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
    SpectrogramData,
    SpectrogramChartAuxData
  > = (canvas, ...rest) => {
    const canvasTransferred = Comlink.transfer(canvas, [
      canvas as OffscreenCanvas,
    ]);
    workerApi.renderCanvas(canvasTransferred, ...rest);
  };

  const auxData: SpectrogramChartAuxData = {
    colorScalePallet,
    renderPartitionDividers,
    partitionDividerColors,
  };

  renderChart<SpectrogramData, number, SpectrogramChartAuxData>(
    "SpectrogramChart",
    containerElem,
    spectrogramData,
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
