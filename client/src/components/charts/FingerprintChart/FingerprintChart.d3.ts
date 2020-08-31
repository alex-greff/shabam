// Renders the D3 fingerprint chart

import * as d3 from "d3";
import { Fingerprint } from "@/audio/types";
import {
  renderChart,
  getHeight,
  getWidth,
  drawPartitionDividers,
} from "@/components/charts/CanvasChartBase.d3";

const POINT_RADIUS = 1.5;

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
  const width = getWidth(outerWidth);
  const height = getHeight(outerHeight);

  // Initialize axis scales
  const xScale = d3
    .scaleLinear()
    .domain([0, fingerprintData.numberOfWindows])
    .range([0, width]);
  const yScale = d3
    .scaleLog()
    .domain([1, fingerprintData.frequencyBinCount + 1])
    .range([height, 0])
    .base(2);

  const renderCanvasWrapped = (
    context: CanvasRenderingContext2D,
    fingerprintData: Fingerprint,
    xScale: d3.AxisScale<number>,
    yScale: d3.AxisScale<number>
  ) =>
    renderCanvas(
      context,
      fingerprintData,
      xScale,
      yScale,
      selectionColor,
      renderPartitionDividers,
      partitionDividerColors
    );

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
  renderPartitionDividers: boolean,
  partitionDividerColors?: [string, string]
) {
  const canvas = context.canvas;

  // Compute the tick size of the axises
  const xAxisTickSize = canvas.width / fingerprintData.numberOfWindows;

  const pointData = fingerprintData.data;
  const numPoints = pointData.length / 2;

  if (pointData.length % 2 !== 0)
    throw "Fingerprint point data length must be a multiple of 2";

  // Render the partition dividers, if needed
  if (renderPartitionDividers) {
    if (!partitionDividerColors)
      throw "Partition divider colors must be defined.";

    drawPartitionDividers(
      context,
      yScale,
      fingerprintData.partitionRanges,
      partitionDividerColors
    );
  }

  // Draw each point on the canvas
  for (let i = 0; i < numPoints; i++) {
    const pointBaseIdx = i * 2;
    const window = pointData[pointBaseIdx];
    const partition = pointData[pointBaseIdx + 1];

    const x = xScale(window)! + xAxisTickSize / 2; // Center the x position

    // Center the y position
    const partitionRange = fingerprintData.partitionRanges[partition];
    const partitionStart = partitionRange[0];
    const partitionEnd = partitionRange[1];
    const partitionMid = (partitionEnd - partitionStart) / 2 + partitionStart;

    const y = yScale(partitionMid)!;

    drawCell(context, x, y, POINT_RADIUS, selectionColor);
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
