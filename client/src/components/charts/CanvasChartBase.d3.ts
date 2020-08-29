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

export type CanvasRenderFunction<Data, Domain extends AxisDomain> = (
  context: CanvasRenderingContext2D,
  data: Data,
  xScale: d3.AxisScale<Domain>,
  yScale: d3.AxisScale<Domain>
) => void;

/**
 * Renders the canvas chart into `containerElem` with the given data.
 * 
 * @param baseClass The base class use for the generated BEM classes.
 * @param containerElem The container element to render the chart in.
 * @param data The data to render.
 * @param colorScalePallet The color scale pallet.
 * @param outerWidth The outer width of the container.
 * @param outerHeight The outer height of the container.
 * @param xAxisScale The x-axis scale to be used.
 * @param canvasRenderFunc The function used to render the canvas.
 * @param yAxisScale The y-axis scale to be used.
 * @param xAxisLabel The x-axis label (optional).
 * @param yAxisLabel The y-axis label (optional).
 */
export function renderChart<Data, Domain extends AxisDomain>(
  baseClass: string,
  containerElem: HTMLElement,
  data: Data,
  outerWidth: number,
  outerHeight: number,
  canvasRenderFunc: CanvasRenderFunction<Data, Domain>,
  xAxisScale: d3.AxisScale<Domain>,
  yAxisScale: d3.AxisScale<Domain>,
  xAxisLabel?: string,
  yAxisLabel?: string,
) {
  // Clear child nodes, for if we have a previous render
  containerElem.innerHTML = "";

  const container = d3.select(containerElem);

  const width = getWidth(outerWidth);
  const height = getHeight(outerHeight);

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

  const context = canvasChart.node()!.getContext("2d");

  // Initialize axises
  const xAxis = d3.axisBottom(xAxisScale);
  const yAxis = d3.axisLeft(yAxisScale);

  // Append the axises
  svgChart
    .append("g")
    .attr("class", `${baseClass}__x-axis`)
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  svgChart
    .append("g")
    .attr("class", `${baseClass}__y-axis`)
    .call(yAxis);

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

  // Call the passed in canvas render function
  canvasRenderFunc(context!, data, xAxisScale, yAxisScale);
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