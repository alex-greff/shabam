import wavefile from "wavefile";
import * as fs from "fs";
import { config } from "../../configuration";
import wav from "node-wav";
import WaveResampler from "wave-resampler";
import { RenderingAudioContext as AudioContext } from "@descript/web-audio-js";

export interface WavFileData {
  readonly sampleRate: number;
  readonly channelData: Float64Array;
}

export async function loadWavFileFromPath(
  path: string,
  doDownsample = true
  // TODO: remove
  // ): Promise<wavefile.WaveFile> {
): Promise<WavFileData> {
  const audioFileBuf = await fs.promises.readFile(path);

  // --- Web-audio-js Version ---
  const context = new AudioContext();
  const fileData = await new Promise<WavFileData>((resolve) => {
    context.decodeAudioData(audioFileBuf, (audioBuffer: AudioBuffer) => {
      // TODO: remove
      // console.log(
      //   ">>>",
      //   audioBuffer.numberOfChannels,
      //   audioBuffer.length,
      //   audioBuffer.sampleRate,
      //   audioBuffer.duration
      // );

      resolve({
        channelData: new Float64Array(audioBuffer.getChannelData(0)),
        sampleRate: audioBuffer.sampleRate,
      });
    });
  });

  if (!doDownsample) return fileData;

  const resampledAudio = WaveResampler.resample(
    fileData.channelData,
    fileData.sampleRate,
    config.TARGET_SAMPLE_RATE
  );
  const resampledChannelData = new Float64Array(resampledAudio);
  const resampledFileData: WavFileData = {
    sampleRate: config.TARGET_SAMPLE_RATE,
    channelData: resampledChannelData
  };

  return resampledFileData;

  // // --- Node-wav Version ---
  // const audioFile = wav.decode(audioFileBuf);
  // // Note: only use one channel for now
  // const channelData = audioFile.channelData[0];

  // console.log(">>> audioFile.sampleRate", audioFile.sampleRate); // TODO: remove

  // if (!doDownsample) {
  //   return {
  //     sampleRate: audioFile.sampleRate,
  //     channelData: new Float64Array(channelData),
  //   };
  // }

  // const resampledAudio = WaveResampler.resample(
  //   channelData,
  //   audioFile.sampleRate,
  //   config.TARGET_SAMPLE_RATE
  // );
  // const resampledChannelData = new Float64Array(resampledAudio);

  // return {
  //   sampleRate: config.TARGET_SAMPLE_RATE,
  //   channelData: resampledChannelData,
  // };

  // --- WaveFile Version ---
  // TODO: remove
  // const audioFile = new wavefile.WaveFile(audioFileBuf);
  // if (doDownsample) audioFile.toSampleRate(config.TARGET_SAMPLE_RATE);

  // return audioFile;
}
