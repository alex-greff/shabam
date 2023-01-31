import * as d3 from "d3";
import { JSDOM } from "jsdom";
import * as fs from "fs";
import path from "path";
import { WavFileData } from "../../src/loader/loader";
import { assert } from "tsafe";

const MAX_WIDTH = 30000;
const DEFAULT_HEIGHT = 1080;

export async function renderTimeDomain(
  waveFileData: WavFileData,
  outputFileName: string,
  dataDir: string,
) {
  const dom = new JSDOM("");
  const { document } = dom.window;
  const body = d3.select(document).select("body") as d3.Selection<
    HTMLElement,
    unknown,
    null,
    undefined
  >;

  const width = Math.min(MAX_WIDTH, waveFileData.channelData.length);
  const height = DEFAULT_HEIGHT;

  const canvas = body
    .append("canvas")
    .attr("width", width)
    .attr("height", height);
  const canvasNode = canvas.node()!;

  renderCanvas(canvasNode, waveFileData, width, height);

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

function renderCanvas(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  waveFileData: WavFileData,
  canvasWidth: number,
  canvasHeight: number
) {
  const context = canvas.getContext("2d")! as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;

  // Set background color
  context.fillStyle = "black";
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  const samples = waveFileData.channelData;

  const minSampleVal = d3.min(samples)!;
  const maxSampleVal = d3.max(samples)!;

  // Samples must be between -1 and 1
  assert(minSampleVal >= -1 && minSampleVal <= 1);
  assert(maxSampleVal >= -1 && maxSampleVal <= 1);

  let prevX = 0;
  let prevY = 0;
  for (let i = 0; i < samples.length; i++) {
    const sampleVal = samples[i];

    const x = ((i + 1) / samples.length) * canvasWidth;
    const y = (sampleVal + 1) * 0.5 * canvasHeight;

    // Draw dot
    // context.fillStyle = "cyan";
    // context.fillRect(x, y, 1, 1);

    if (i > 0) {
      // Draw line between the last two points
      context.beginPath();
      context.moveTo(prevX, prevY);
      context.lineTo(x, y);
      context.strokeStyle = "cyan";
      context.lineWidth = 1;
      context.stroke();
    }

    prevX = x;
    prevY = y;
  }
}
