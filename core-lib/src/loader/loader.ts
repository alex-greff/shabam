import * as fs from "fs";
import { config } from "../configuration";
import WaveResampler from "wave-resampler";
import { RenderingAudioContext as AudioContext } from "@descript/web-audio-js";

export interface WavFileData {
  readonly sampleRate: number;
  readonly channelData: Float32Array;
}

export async function loadWavFileFromPath(
  path: string,
  doDownsample = true
): Promise<WavFileData> {
  const audioFileBuf = await fs.promises.readFile(path);

  const context = new AudioContext();
  const fileData = await new Promise<WavFileData>((resolve) => {
    context.decodeAudioData(audioFileBuf, (audioBuffer: AudioBuffer) => {
      resolve({
        // NOTE: for now we just use the first channel
        channelData: audioBuffer.getChannelData(0),
        sampleRate: audioBuffer.sampleRate,
      });
    });
  });

  if (!doDownsample) return fileData;

  const resampledAudio = WaveResampler.resample(
    fileData.channelData,
    fileData.sampleRate,
    config.INPUT_TARGET_SAMPLE_RATE
  );
  const resampledChannelData = new Float32Array(resampledAudio);
  const resampledFileData: WavFileData = {
    sampleRate: config.INPUT_TARGET_SAMPLE_RATE,
    channelData: resampledChannelData
  };

  return resampledFileData;
}
