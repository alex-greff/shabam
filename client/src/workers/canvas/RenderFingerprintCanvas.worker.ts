import { Fingerprint } from "@/audio/types";
import { renderCanvas } from "@/components/charts/FingerprintChart/FingerprintChart.renderer";
import { FingerprintChartAuxData } from "@/components/charts/FingerprintChart/types";
import * as Comlink from "comlink";
import { RenderChartCanvasWorker } from "./types";

export type RenderFingerprintCanvasWorker = RenderChartCanvasWorker<
  Fingerprint,
  FingerprintChartAuxData
>;

const exports: RenderFingerprintCanvasWorker = {
  renderCanvas,
};

Comlink.expose(exports);
