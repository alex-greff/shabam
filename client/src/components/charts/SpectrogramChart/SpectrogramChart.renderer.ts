// Worker-safe canvas rendering functions for the spectrogram chart

import * as d3 from "d3";
import { SpectrogramData } from "@/audio/types";
import {
  drawPartitionDividers,
  CanvasRenderFunction,
  CanvasGetScaleFunction,
} from "@/components/charts/CanvasChartBase.d3";
import { computePartitionRanges } from "@/audio/utilities";
import { SpectrogramChartAuxData } from "./types";

// The number of pixels each cell bleeds over into the next
const X_BLEED = 0;
const Y_BLEED = 0.5;

export const getAxisScales: CanvasGetScaleFunction<SpectrogramData, number> = (
  spectrogramData,
  canvasWidth,
  canvasHeight
) => {
  const xScale = d3
    .scaleLinear()
    .domain([0, spectrogramData.numberOfWindows])
    .range([0, canvasWidth]);

  const yScale = d3
    .scaleLog()
    .domain([1, spectrogramData.frequencyBinCount + 1])
    .range([canvasHeight, 0])
    .base(2);

  return {
    xScale,
    yScale,
  };
};

/**
 * Generates a color scale from the given pallet and maximum value.
 */
function generateColorScale(pallet: string[], maxVal: number) {
  const domainArray = pallet.map((_, idx) => {
    return (maxVal * (idx + 1)) / pallet.length;
  });
  // First element in domain must be 0
  domainArray.unshift(0);

  const colorScale = d3.scaleLinear<string>().range(pallet).domain(domainArray);

  return colorScale;
}

/**
 * Renders the spectrogram data to the canvas context.
 */
export const renderCanvas: CanvasRenderFunction<
  SpectrogramData,
  SpectrogramChartAuxData
> = (
  canvas,
  spectrogramData,
  canvasWidth,
  canvasHeight,
  { colorScalePallet, renderPartitionDividers, partitionDividerColors }
) => {
  const { xScale, yScale } = getAxisScales(
    spectrogramData,
    canvasWidth,
    canvasHeight
  );

  const context = canvas.getContext("2d");

  if (context == null)
    throw "Unable to get 2D context from canvas.";

  // Get the largest value in the spectrogram data
  const maxVal = d3.max(spectrogramData.data)!;

  // Compute the tick size of the xAxis
  const xAxisTickSize = canvasWidth / spectrogramData.numberOfWindows;

  // Generate color scale from pallet
  const colorScale = generateColorScale(colorScalePallet, maxVal);

  // Render the partition dividers, if needed
  if (renderPartitionDividers) {
    if (!partitionDividerColors)
      throw "Partition divider colors must be defined.";

    const partitions = computePartitionRanges();
    drawPartitionDividers(context, yScale, partitions, partitionDividerColors);
  }

  // Draw each cell on the canvas
  for (let window = 0; window < spectrogramData.numberOfWindows; window++) {
    for (let bin = 0; bin < spectrogramData.frequencyBinCount; bin++) {
      const cellIdx = window * spectrogramData.frequencyBinCount + bin;
      const cellValue = spectrogramData.data[cellIdx];

      // Don't plot 0 values
      if (cellValue === 0) continue;

      const color = colorScale(cellValue);
      const x = xScale(window)!;
      const y = yScale(bin + 1)!;

      const yPrev = yScale(bin)!;
      const height = yPrev - y;

      drawCell(context, x, y, xAxisTickSize, height, color);
    }
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
