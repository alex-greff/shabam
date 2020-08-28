// Renders the D3 spectrogram chart

import * as d3 from "d3";
import { SpectrogramData } from "@/audio/types";

const MARGIN = {
  top: 20,
  right: 15,
  bottom: 60,
  left: 70,
};

const X_AXIS_LABEL = "Window";
const Y_AXIS_LABEL = "Frequency Bin";

export function renderSpectrogramChart(
  containerElem: HTMLDivElement,
  spectrogramData: SpectrogramData
) {
  console.log("Rendering spectrogram chart...", containerElem, spectrogramData);

  // Clear child nodes, for if we have a previous render
  containerElem.innerHTML = "";

  const container = d3.select(containerElem);

  const outerWidth = containerElem.offsetWidth;
  const outerHeight = containerElem.offsetHeight;

  const width = outerWidth - MARGIN.left - MARGIN.right;
  const height = outerHeight - MARGIN.top - MARGIN.bottom;

  // Initialize SVG component container
  const svgChart = container
    .append("svg:svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .attr("class", "SpectrogramChart__svg-chart")
    .append("g")
    .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

  // Initialize canvas component container
  const canvasChart = container
    .append("canvas")
    .attr("width", width)
    .attr("height", height)
    .style("margin-left", `${MARGIN.left}px`)
    .style("margin-top", `${MARGIN.top}px`)
    .attr("class", "SpectrogramChart__canvas-chart");

  const context = canvasChart.node()!.getContext("2d");

  // Initialize axis scales
  const xScale = d3
    .scaleLinear()
    .domain([0, spectrogramData.numberOfWindows])
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain([0, spectrogramData.frequencyBinCount])
    .range([height, 0]);

  // Initialize axises
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // Append the axises
  const gxAxis = svgChart
    .append("g")
    .attr("class", "SpectrogramChart__x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  const gyAxis = svgChart
    .append("g")
    .attr("class", "SpectrogramChart__y-axis")
    .call(yAxis);

  // Add axis labels
  svgChart
    .append("text")
    .attr("class", "SpectrogramChart__x-axis-label")
    .attr("x", `${width / 2}`)
    .attr("y", `${height + 40}`)
    .attr("text-anchor", "middle")
    .text(X_AXIS_LABEL);
  svgChart
    .append("text")
    .attr("class", "SpectrogramChart__y-axis-label")
    .attr("x", `-${height / 2}`)
    .attr("dy", "-50")
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text(Y_AXIS_LABEL);

  renderCanvas(context!, spectrogramData, xScale, yScale);
}

/**
 * Renders the spectrogram data to the canvas context.
 */
function renderCanvas(
  context: CanvasRenderingContext2D,
  spectrogramData: SpectrogramData,
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>
) {
  // Get the largest value in the spectrogram data
  const maxVal = d3.max(spectrogramData.data)!;

  console.log("MaxVal", maxVal);

  // Initialize color scale
  const colorScale = d3.scaleLinear<string>()
    .range(["rgba(0, 0, 0, 0)", "rgba(230, 0, 0, 1)", "rgba(255, 210, 0, 1)", "rgba(255, 255, 255, 1)"])
    .domain([0, maxVal/4, maxVal/2, maxVal*3/4, maxVal]);

  // Draw each cell on the canvas
  for (let window = 0; window < spectrogramData.numberOfWindows; window++) {
    for (let bin = 0; bin < spectrogramData.frequencyBinCount; bin++) {
      const cellIdx = window * spectrogramData.frequencyBinCount + bin;
      const cellValue = spectrogramData.data[cellIdx];

      // Don't plot 0 values
      if (cellValue === 0)
        continue;

      const color = colorScale(cellValue);
      const x = xScale(window);
      const y = yScale(bin);

      drawCell(context, x, y, color);
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
  color: string
) {
  // TODO: change to rectangle
  context.beginPath();
  context.fillStyle = color;
  const px = x;
  const py = y;

  context.arc(px, py, 0.8, 0, 2 * Math.PI,true);
  context.fill();
}
