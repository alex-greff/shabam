// Renders the D3 fingerprint chart

import * as d3 from "d3";
import { Fingerprint } from "@/audio/types";
import {
  renderChart,
  getHeight,
  getWidth,
} from "@/components/charts/CanvasChartBase.d3";

const POINT_RADIUS = 3.5;

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
  yAxisLabel?: string
) {
  const width = getWidth(outerWidth);
  const height = getHeight(outerHeight);

  // Initialize axis scales
  const xScale = d3
    .scaleLinear()
    .domain([0, fingerprintData.numberOfWindows])
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain([0, fingerprintData.numberOfPartitions + 0.5])
    .range([height, 0]);

  const renderCanvasWrapped = (
    context: CanvasRenderingContext2D,
    fingerprintData: Fingerprint,
    xScale: d3.AxisScale<number>,
    yScale: d3.AxisScale<number>
  ) => renderCanvas(context, fingerprintData, xScale, yScale, selectionColor);

  renderChart<Fingerprint, number>(
    "FingerprintChart",
    containerElem,
    fingerprintData,
    outerWidth,
    outerHeight,
    renderCanvasWrapped,
    xScale,
    yScale,
    xAxisLabel,
    yAxisLabel
  );
}

function renderCanvas(
  context: CanvasRenderingContext2D,
  fingerprintData: Fingerprint,
  xScale: d3.AxisScale<number>,
  yScale: d3.AxisScale<number>,
  selectionColor: string,
) {
  const canvas = context.canvas;

  // Compute the tick size of the axises
  const xAxisTickSize = canvas.width / fingerprintData.numberOfWindows;
  const yAxisTickSize = canvas.height / fingerprintData.numberOfPartitions;

  const radius = Math.min(xAxisTickSize, yAxisTickSize, POINT_RADIUS) / 2;

  const numWindows = fingerprintData.numberOfWindows;
  const numPartitions = fingerprintData.numberOfPartitions;

  // Draw each point on the canvas
  for (let window = 0; window < numWindows; window++) {
    for (let partition = 0; partition < numPartitions; partition++) {
      const cellIdx = window * fingerprintData.numberOfPartitions + partition;
      const cellValue = fingerprintData.data[cellIdx];

      // Don't plot 0 values
      if (cellValue === 0) continue;

      const x = xScale(window)! + xAxisTickSize / 2; // Center the x position
      const y = yScale(partition + 1)!;

      drawCell(context, x, y, radius, selectionColor);
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
  radius: number,
  color: string
) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, true);
  context.fill();
}