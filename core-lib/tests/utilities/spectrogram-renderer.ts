import * as d3 from "d3";
import { JSDOM } from "jsdom";
import * as fs from "fs";
import path from "path";
import {
  CanvasGetScaleFunction,
  CanvasRenderFunction,
  drawPartitionDividers,
} from "./canvas-chart-base";
import { SpectrogramData } from "../../src/fingerprint/types";
import { computePartitionRanges } from "../../src/utilities/audio";

// Reference: https://stackoverflow.com/a/57397987

interface SpectrogramChartAuxData {
  colorScalePallet: string[];
  renderPartitionDividers: boolean;
  partitionDividerColors?: [string, string];
  backgroundColor: string;
}

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;

const AUX_DATA: SpectrogramChartAuxData = {
  colorScalePallet: [
    "rgba(0, 0, 0, 0)",
    "rgba(8, 79, 200, 0.8)",
    "rgba(0, 252, 239, 1)",
    "rgba(255, 255, 255, 1)",
  ],
  renderPartitionDividers: true,
  partitionDividerColors: [
    "rgba(80, 80, 80, 0.2)",
    "rgba(100, 100, 100, 0.2)",
  ],
  backgroundColor: "black",
};

export async function renderSpectrogram(
  spectrogramData: SpectrogramData,
  outputFileName: string,
  dataDir: string,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT
) {
  const dom = new JSDOM("");
  const { document } = dom.window;
  const body = d3.select(document).select("body") as d3.Selection<
    HTMLElement,
    unknown,
    null,
    undefined
  >;

  const canvas = body
    .append("canvas")
    .attr("width", width)
    .attr("height", height);
  const canvasNode = canvas.node()!;

  renderCanvas(canvasNode, spectrogramData, width, height, AUX_DATA);

  // Save canvas to PNG
  // Source: https://stackoverflow.com/a/5971674
  // Note: trying to use canvasNode.toBlob will not work because JSDOM does not
  // implement Blob.arrayBuffer so we cannot read it at all
  const dataAll = canvasNode.toDataURL();
  // strip off the data: url prefix to get just the base64-encoded bytes
  const data = dataAll.replace(/^data:image\/\w+;base64,/, "");
  const buf = Buffer.from(data, "base64");
  await fs.promises.writeFile(path.join(dataDir, outputFileName), buf);
}

// The number of pixels each cell bleeds over into the next
const X_BLEED = 0;
const Y_BLEED = 0.5;

const getAxisScales: CanvasGetScaleFunction<SpectrogramData, number> = (
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
const renderCanvas: CanvasRenderFunction<
  SpectrogramData,
  SpectrogramChartAuxData
> = (
  canvas,
  spectrogramData,
  canvasWidth,
  canvasHeight,
  {
    colorScalePallet,
    renderPartitionDividers,
    partitionDividerColors,
    backgroundColor,
  }
) => {
  const { xScale, yScale } = getAxisScales(
    spectrogramData,
    canvasWidth,
    canvasHeight
  );

  const context = canvas.getContext("2d") as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D
    | null;

  if (context == null) throw "Unable to get 2D context from canvas.";

  // Set background color
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvasWidth, canvasHeight);

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

      drawCell(context, x, y, xAxisTickSize, height, color!);
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
