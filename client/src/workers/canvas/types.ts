import { CanvasRenderFunction } from "@/components/charts/CanvasChartBase.d3";

export interface RenderChartCanvasWorker<Data, Aux> {
  renderCanvas: CanvasRenderFunction<Data, Aux>; 
}