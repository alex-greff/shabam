// Renders the D3 spectrogram chart

import * as d3 from "d3";
import { SpectrogramData } from "@/audio/types";
import {
  renderChart,
  getHeight,
  getWidth,
  drawPartitionDividers
} from "@/components/charts/CanvasChartBase.d3";
import { computePartitionRanges } from "@/audio/utilities";

// The number of pixels each cell bleeds over into the next
const X_BLEED = 0;
const Y_BLEED = 0.5;

/**
 * Renders a spectrogram chart into `containerElem`.
 *
 * @param containerElem The container to render into.
 * @param spectrogramData The spectrogram data.
 * @param colorScalePallet The color scale pallet.
 * @param outerWidth The outer width of the container.
 * @param outerHeight The outer height of the container
 * @param xAxisLabel The x-axis label.
 * @param yAxisLabel The y-axis label.
 */
export function renderSpectrogramChart(
  containerElem: HTMLDivElement,
  spectrogramData: SpectrogramData,
  colorScalePallet: string[],
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
    .domain([0, spectrogramData.numberOfWindows])
    .range([0, width]);
  const yScale = d3
    .scaleLog()
    .domain([1, spectrogramData.frequencyBinCount + 1])
    .range([height, 0])
    .base(2);

  const renderCanvasWrapped = (
    context: CanvasRenderingContext2D,
    spectrogramData: SpectrogramData,
    xScale: d3.AxisScale<number>,
    yScale: d3.AxisScale<number>
  ) =>
    renderCanvas(
      context,
      spectrogramData,
      xScale,
      yScale,
      colorScalePallet,
      renderPartitionDividers,
      partitionDividerColors
    );

  renderChart<SpectrogramData, number>(
    "SpectrogramChart",
    containerElem,
    spectrogramData,
    outerWidth,
    outerHeight,
    renderCanvasWrapped,
    xScale,
    yScale,
    xAxisLabel,
    yAxisLabel
  );
}

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
function renderCanvas(
  context: CanvasRenderingContext2D,
  spectrogramData: SpectrogramData,
  xScale: d3.AxisScale<number>,
  yScale: d3.AxisScale<number>,
  colorScalePallet: string[],
  renderPartitionDividers: boolean,
  partitionDividerColors?: [string, string]
) {
  // Get the largest value in the spectrogram data
  const maxVal = d3.max(spectrogramData.data)!;

  const canvas = context.canvas;

  // Compute the tick size of the xAxis
  const xAxisTickSize = canvas.width / spectrogramData.numberOfWindows;

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