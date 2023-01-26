import { PartitionRanges } from "../../src/fingerprint/types";
// Base D3 code for rendering canvas charts
import * as d3 from "d3";
import { AxisDomain } from "d3";

// Margin configurations
const MARGIN = {
  top: 10,
  right: 15,
  bottom: 60, // should be > X_AXIS_LABEL_GAP
  left: 70, // should be > Y_AXIS_LABEL_GAP
};

// Gap between axis and the labels
const X_AXIS_LABEL_GAP = 35;
const Y_AXIS_LABEL_GAP = 35;

export type RenderChartFunction<
  Data,
  Domain extends AxisDomain,
  Aux
> = typeof renderChart;

export type CanvasRenderFunction<Data, Aux> = (
  canvas: HTMLCanvasElement | OffscreenCanvas,
  data: Data,
  canvasWidth: number,
  canvasHeight: number,
  auxData: Aux
) => unknown;

export type CanvasGetScaleFunction<Data, Domain extends AxisDomain> = (
  data: Data,
  canvasWidth: number,
  canvasHeight: number
) => { xScale: d3.AxisScale<Domain>; yScale: d3.AxisScale<Domain> };

export interface CanvasOfflineRenderFunction<Data, Aux> {
  offlineCanvasRenderFunc: CanvasRenderFunction<Data, Aux>;
  fallbackCanvasRenderFunc: CanvasRenderFunction<Data, Aux>;
}

/**
 * Renders the canvas chart into `containerElem` with the given data
 * using a regular canvas context.
 *
 * @param baseClass The base class use for the generated BEM classes.
 * @param containerElem The container element to render the chart in.
 * @param data The data to render.
 * @param outerWidth The outer width of the container.
 * @param outerHeight The outer height of the container.
 * @param auxData The auxillary data passed to the canvas render function.
 * @param canvasRenderFunc The function used to render the canvas.
 * @param getScale Function used to obtain the scales used in the chart.
 * @param xAxisLabel The x-axis label (optional).
 * @param yAxisLabel The y-axis label (optional).
 * @param renderOffscreen Render the canvas in an offscreen context.
 */
export function renderChart<Data, Domain extends AxisDomain, Aux>(
  baseClass: string,
  containerElem: HTMLElement,
  data: Data,
  outerWidth: number,
  outerHeight: number,
  auxData: Aux,
  canvasRenderFunc: CanvasRenderFunction<Data, Aux>,
  getScale: CanvasGetScaleFunction<Data, Domain>,
  xAxisLabel?: string,
  yAxisLabel?: string
): void;
/**
 * Renders the canvas chart into `containerElem` with the given data using
 * an offline canvas context. If offscreen canvases are not supported then
 * the fallback function will be used
 *
 * @param baseClass The base class use for the generated BEM classes.
 * @param containerElem The container element to render the chart in.
 * @param data The data to render.
 * @param outerWidth The outer width of the container.
 * @param outerHeight The outer height of the container.
 * @param auxData The auxillary data passed to the canvas render function.
 * @param offlineCanvasRenderFunc The function used to render the canvas.
 * @param getScale Function used to obtain the scales used in the chart.
 * @param xAxisLabel The x-axis label (optional).
 * @param yAxisLabel The y-axis label (optional).
 * @param renderOffscreen Render the canvas in an offscreen context.
 */
export function renderChart<Data, Domain extends AxisDomain, Aux>(
  baseClass: string,
  containerElem: HTMLElement,
  data: Data,
  outerWidth: number,
  outerHeight: number,
  auxData: Aux,
  offlineCanvasRenderFunc: CanvasOfflineRenderFunction<Data, Aux>,
  getScale: CanvasGetScaleFunction<Data, Domain>,
  xAxisLabel?: string,
  yAxisLabel?: string
): void;
export function renderChart<Data, Domain extends AxisDomain, Aux>(
  baseClass: string,
  containerElem: HTMLElement,
  data: Data,
  outerWidth: number,
  outerHeight: number,
  auxData: Aux,
  renderData: any,
  getScale: CanvasGetScaleFunction<Data, Domain>,
  xAxisLabel?: string,
  yAxisLabel?: string
) {
  // Clear child nodes, for if we have a previous render
  containerElem.innerHTML = "";

  const container = d3.select(containerElem);

  const width = getWidth(outerWidth);
  const height = getHeight(outerHeight);

  const { xScale, yScale } = getScale(data, width, height);

  // Initialize canvas component container
  const canvasChart = container
    .append("canvas")
    .attr("width", width)
    .attr("height", height)
    .style("margin-left", `${MARGIN.left}px`)
    .style("margin-top", `${MARGIN.top}px`)
    .attr("class", `${baseClass}__canvas-chart`);

  // Initialize SVG component container
  const svgChart = container
    .append("svg:svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .attr("class", `${baseClass}__svg-chart`)
    .append("g")
    .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

  // Initialize axises
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // Append the axises
  svgChart
    .append("g")
    .attr("class", `${baseClass}__x-axis`)
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  svgChart.append("g").attr("class", `${baseClass}__y-axis`).call(yAxis);

  // Add axis labels
  if (xAxisLabel) {
    svgChart
      .append("text")
      .attr("class", `${baseClass}__x-axis-label`)
      .attr("x", `${width / 2}`)
      .attr("y", `${height + X_AXIS_LABEL_GAP}`)
      .attr("text-anchor", "middle")
      .text(xAxisLabel);
  }
  if (yAxisLabel) {
    svgChart
      .append("text")
      .attr("class", `${baseClass}__y-axis-label`)
      .attr("x", `-${height / 2}`)
      .attr("dy", `-${Y_AXIS_LABEL_GAP}`)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text(yAxisLabel);
  }

  const offscreenCompatible = "OffscreenCanvas" in window;
  const canvas = canvasChart.node()!;

  // Determine if we are in the overload that wants to render offscreen
  const renderOffscreen = "offlineCanvasRenderFunc" in renderData;

  let canvasRenderFunc: CanvasRenderFunction<Data, Aux> | null = null;

  // Determine which render function to use
  if (renderOffscreen) {
    const {
      offlineCanvasRenderFunc,
      fallbackCanvasRenderFunc,
    } = renderData as CanvasOfflineRenderFunction<Data, Aux>;

    canvasRenderFunc = offscreenCompatible
      ? offlineCanvasRenderFunc
      : fallbackCanvasRenderFunc;
  } else {
    canvasRenderFunc = renderData as CanvasRenderFunction<Data, Aux>;
  }

  // Run canvas render function with offscreen context if specified
  // and supported
  if (renderOffscreen && offscreenCompatible) {
    const offscreen = canvas.transferControlToOffscreen();
    canvasRenderFunc!(offscreen, data, width, height, auxData);
  }
  // Otherwise just run it with a regular canvas context
  else {
    canvasRenderFunc!(canvas, data, width, height, auxData);
  }
}

/**
 * Computes the chart height from the given outer height.
 */
export function getHeight(outerHeight: number) {
  return outerHeight - MARGIN.top - MARGIN.bottom;
}

/**
 * Computes the chart width from the given outer width.
 */
export function getWidth(outerWidth: number) {
  return outerWidth - MARGIN.left - MARGIN.right;
}

export function drawPartitionDividers(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  yScale: d3.AxisScale<number>,
  partitions: PartitionRanges,
  partitionDividerColors: [string, string]
) {
  for (let i = 0; i < partitions.length; i++) {
    const currPartitionRange = partitions[i];
    const partitionStart = currPartitionRange[0];
    const partitionEnd = currPartitionRange[1];

    const startY = yScale(partitionStart + 1)!;
    const endY = yScale(partitionEnd + 1)!;

    // Alternate between the two colors
    const color = partitionDividerColors[i % 2];

    drawFillRegion(context, startY, endY, color);
  }
}

/**
 * Draws a horizontal filled region onto the canvas context from
 * `yTop` to `yBottom`.
 */
export function drawFillRegion(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  yStart: number,
  yEnd: number,
  color: string
) {
  const canvas = context.canvas;
  const width = canvas.width;

  context.fillStyle = color;
  context.fillRect(0, yEnd, width, yStart - yEnd);
}
