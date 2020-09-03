import { SpectrogramData } from "@/audio/types";
import { renderCanvas } from "@/components/charts/SpectrogramChart/SpectrogramChart.renderer";
import { SpectrogramChartAuxData } from "@/components/charts/SpectrogramChart/types";
import * as Comlink from "comlink";
import { RenderChartCanvasWorker } from "./types";

export type RenderSpectrogramCanvasWorker = RenderChartCanvasWorker<
  SpectrogramData,
  SpectrogramChartAuxData
>;

const exports: RenderSpectrogramCanvasWorker = {
  renderCanvas,
};

Comlink.expose(exports);
