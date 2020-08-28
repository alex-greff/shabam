// Renders the D3 spectrogram chart

import * as d3 from "d3";
import { SpectrogramData } from "@/audio/types";

// Margin configurations
const MARGIN = {
  top: 20,
  right: 15,
  bottom: 60, // should be > X_AXIS_LABEL_GAP
  left: 70, // should be > Y_AXIS_LABEL_GAP
};

// Axis labels
const X_AXIS_LABEL = "Window";
const Y_AXIS_LABEL = "Frequency Bin";

// Gap between axis and the labels
const X_AXIS_LABEL_GAP = 35;
const Y_AXIS_LABEL_GAP = 35;

// The number of pixels each cell bleeds over into the next
const X_BLEED = 0;
const Y_BLEED = 0.5;

export function renderSpectrogramChart(
  containerElem: HTMLDivElement,
  spectrogramData: SpectrogramData,
  colorScalePallet: string[],
  outerWidth: number,
  outerHeight: number
) {
  // Clear child nodes, for if we have a previous render
  containerElem.innerHTML = "";

  const container = d3.select(containerElem);

  const width = outerWidth - MARGIN.left - MARGIN.right;
  const height = outerHeight - MARGIN.top - MARGIN.bottom;

  // Initialize canvas component container
  const canvasChart = container
    .append("canvas")
    .attr("width", width)
    .attr("height", height)
    .style("margin-left", `${MARGIN.left}px`)
    .style("margin-top", `${MARGIN.top}px`)
    .attr("class", "SpectrogramChart__canvas-chart");

  // Initialize SVG component container
  const svgChart = container
    .append("svg:svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .attr("class", "SpectrogramChart__svg-chart")
    .append("g")
    .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

  const context = canvasChart.node()!.getContext("2d");

  // Initialize axis scales
  const xScale = d3
    .scaleLinear()
    .domain([0, spectrogramData.numberOfWindows])
    .range([0, width]);
  const yScale = d3
    .scaleLog()
    .domain([1, spectrogramData.frequencyBinCount + 1])
    .range([height, 0])
    .base(2);

  // Initialize axises
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // Append the axises
  svgChart
    .append("g")
    .attr("class", "SpectrogramChart__x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  svgChart
    .append("g")
    .attr("class", "SpectrogramChart__y-axis")
    .call(yAxis);

  // Add axis labels
  svgChart
    .append("text")
    .attr("class", "SpectrogramChart__x-axis-label")
    .attr("x", `${width / 2}`)
    .attr("y", `${height + X_AXIS_LABEL_GAP}`)
    .attr("text-anchor", "middle")
    .text(X_AXIS_LABEL);
  svgChart
    .append("text")
    .attr("class", "SpectrogramChart__y-axis-label")
    .attr("x", `-${height / 2}`)
    .attr("dy", `-${Y_AXIS_LABEL_GAP}`)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text(Y_AXIS_LABEL);

  renderCanvas(context!, spectrogramData, xScale, yScale, colorScalePallet);
}

/**
 * Generates a color scale from the given pallet and maximum value.
 */
function generateColorScale(pallet: string[], maxVal: number) {
  const domainArray = pallet.map((_, idx) => {
    return maxVal * (idx+1) / pallet.length;
  });
  // First element in domain must be 0
  domainArray.unshift(0);

  const colorScale = d3
    .scaleLinear<string>()
    .range(pallet)
    .domain(domainArray);
  
  return colorScale;
}

/**
 * Renders the spectrogram data to the canvas context.
 */
function renderCanvas(
  context: CanvasRenderingContext2D,
  spectrogramData: SpectrogramData,
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLogarithmic<number, number>,
  colorScalePallet: string[]
) {
  // Get the largest value in the spectrogram data
  const maxVal = d3.max(spectrogramData.data)!;

  const canvas = context.canvas;

  // Compute the tick size of the xAxis
  const xAxisTickSize = canvas.width / spectrogramData.numberOfWindows;

  // Generate color scale from pallet
  const colorScale = generateColorScale(colorScalePallet, maxVal);

  // Draw each cell on the canvas
  for (let window = 0; window < spectrogramData.numberOfWindows; window++) {
    for (let bin = 0; bin < spectrogramData.frequencyBinCount; bin++) {
      const cellIdx = window * spectrogramData.frequencyBinCount + bin;
      const cellValue = spectrogramData.data[cellIdx];

      // Don't plot 0 values
      if (cellValue === 0) continue;

      const color = colorScale(cellValue);
      const x = xScale(window);
      const y = yScale(bin + 1);

      const yPrev = yScale(bin);
      const height = yPrev - y;

      drawCell(context, x, y, xAxisTickSize, height, color);
    }
  }
}

/**
 * Draws one cell onto the canvas context at the given x and y coordinates
 * with the given color.
 */
function drawCell(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) {
  context.fillStyle = color;
  context.fillRect(
    x - X_BLEED,
    y - Y_BLEED,
    width + 2 * X_BLEED,
    height + 2 * Y_BLEED
  );
}
