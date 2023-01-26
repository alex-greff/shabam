import { Fingerprint } from "../../src/fingerprint/types";
import {
  CanvasGetScaleFunction,
  CanvasRenderFunction,
  drawPartitionDividers,
} from "./canvas-chart-base";
import * as d3 from "d3";
import { JSDOM } from "jsdom";
import path from "path";
import * as fs from "fs";

interface FingerprintChartAuxData {
  selectionColor: string;
  renderPartitionDividers: boolean;
  partitionDividerColors?: [string, string];
  backgroundColor: string;
}

const POINT_RADIUS = 1.5;

const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 300;

export async function renderFingerprint(
  fingerprint: Fingerprint,
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

  const auxData: FingerprintChartAuxData = {
    selectionColor: "#08B4F4",
    renderPartitionDividers: true,
    partitionDividerColors: [
      "rgba(80, 80, 80, 0.2)",
      "rgba(100, 100, 100, 0.2)",
    ],
    backgroundColor: "black",
  };

  renderCanvas(canvasNode, fingerprint, width, height, auxData);

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

const getAxisScales: CanvasGetScaleFunction<Fingerprint, number> = (
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

const renderCanvas: CanvasRenderFunction<
  Fingerprint,
  FingerprintChartAuxData
> = (
  canvas,
  fingerprintData,
  canvasWidth,
  canvasHeight,
  {
    selectionColor,
    renderPartitionDividers,
    partitionDividerColors,
    backgroundColor,
  }
) => {
  const { xScale, yScale } = getAxisScales(
    fingerprintData,
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
