// Worker-safe canvas rendering functions for the fingerprint chart

import {
  drawPartitionDividers,
  CanvasRenderFunction,
  CanvasGetScaleFunction
} from "@/components/charts/CanvasChartBase.d3";
import { Fingerprint } from "@/audio/types";
import { FingerprintChartAuxData } from "./types";
import * as d3 from "d3";

const POINT_RADIUS = 1.5;

export const getAxisScales: CanvasGetScaleFunction<Fingerprint, number> = (
  fingerprintData,
  canvasWidth,
  canvasHeight
) => {
  const xScale = d3
    .scaleLinear()
    .domain([0, fingerprintData.numberOfWindows])
    .range([0, canvasWidth]);

  const yScale = d3
    .scaleLog()
    .domain([1, fingerprintData.frequencyBinCount + 1])
    .range([canvasHeight, 0])
    .base(2);

  return {
    xScale,
    yScale,
  };
};

export const renderCanvas: CanvasRenderFunction<
  Fingerprint,
  FingerprintChartAuxData
> = (
  canvas,
  fingerprintData,
  canvasWidth,
  canvasHeight,
  { selectionColor, renderPartitionDividers, partitionDividerColors }
) => {
  const { xScale, yScale } = getAxisScales(
    fingerprintData,
    canvasWidth,
    canvasHeight
  );

  const context = canvas.getContext("2d");

  if (context == null)
    throw "Unable to get 2D context from canvas.";

  // Compute the tick size of the axises
  const xAxisTickSize = canvasWidth / fingerprintData.numberOfWindows;

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
};

/**
 * Draws one cell onto the canvas context at the given x and y coordinates
 * with the given color.
 */
function drawCell(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
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