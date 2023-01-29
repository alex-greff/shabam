import { isNode } from "browser-or-node";
import { FFT } from "dsp.js";
import { assert } from "tsafe";
import wavefile from "wavefile";
import { config } from "../../configuration";
import { ComputeSpectrogramDataOptions, SpectrogramData } from "../types";
import * as AudioUtilities from "../../utilities/audio";
import Ooura from "ooura";
import { WavFileData } from "./loader";
import Spectro from "spectro";
import { Duplex } from "stream";

/**
 * Resamples the given audio WAV file to the given sample rate.
 * For Node.js only
 */
export function resample(
  audio: wavefile.WaveFile,
  sampleRate: number
): wavefile.WaveFile {
  assert(isNode);

  audio.toSampleRate(sampleRate);

  return audio;
}

function computeFFTData(
  audio: WavFileData,
  sampleRate = config.TARGET_SAMPLE_RATE,
  windowIndex: number,
  windowDuration: number,
  FFTSize: number
): Float64Array {
  // Calculate the start index from where the copy will take place
  const startIndex = Math.floor(sampleRate * windowDuration * windowIndex);

  // TODO: remove, this does not work
  // // TODO: only uses one channel at the moment
  // // Create the buffer for the FFT
  // // Issue with length being ignored: https://github.com/nodejs/node/issues/22387
  // const fftBuffer = Buffer.from(audio.getSamples()[0].buffer, startIndex, FFTSize);

  // // Perform the FFT
  // const fft = new FFT(FFTSize, sampleRate);
  // fft.forward(fftBuffer);

  // const spectrum = fft.spectrum;
  // return spectrum;

  // TODO: not sure why the output buffer is the same size as the input buffer
  // From what I understand it should be half the size
  // (FFTSize/2 rather than FFTSize)
  // Issue with length being ignored: https://github.com/nodejs/node/issues/22387
  // so we need to pass it the buffer, not the typed array
  // const buf = Buffer.from(
  //   audio.channelData.buffer,
  //   startIndex,
  //   FFTSize
  //   // Math.floor(FFTSize / 2)
  // );

  // TODO: remove
  // const oo = new Ooura(inputBuf.length, {"type":"real", "radix":4});
  // const oo = new Ooura(buf.length, { type: "real", radix: 4 });
  // oo.fftInPlace(buf);
  // const re = oo.vectorArrayFactory();
  // const im = oo.vectorArrayFactory();
  // oo.fft(inputBuf, re.buffer, im.buffer); // Populates re and im from input

  // return new Float64Array(buf);

  const windowSamples = audio.channelData.slice(startIndex, startIndex + (sampleRate * windowDuration));
  const oo = new Ooura(FFTSize, { type: "real", radix: 4 });
  oo.fftInPlace(windowSamples);

  return windowSamples;
}

function bufferToStream(buf: Buffer): Duplex {
  let tmp = new Duplex();
  tmp.push(buf);
  tmp.push(null);
  return tmp;
}

/**
 * Computes the spectrogram data for the given audio file. Note: assumes the
 * given audio is already resampled to `sampleRate`.
 *
 * @param audio The audio to compute the spectrogram of.
 * @param sampleRate The sample rate of the audio.
 * @param options Spectrogram options.
 */
export async function computeSpectrogramData(
  audio: WavFileData,
  sampleRate = config.TARGET_SAMPLE_RATE,
  options: Partial<ComputeSpectrogramDataOptions> = {}
): Promise<SpectrogramData> {
  assert(isNode);

  const defaultOptions: ComputeSpectrogramDataOptions = {
    windowDuration: config.WINDOW_DURATION,
    FFTSize: config.FFT_SIZE,
    windowSmoothing: config.WINDOW_SMOOTHING,
  };

  const optionsNormalized: ComputeSpectrogramDataOptions = {
    ...defaultOptions,
    ...options,
  };
  const { FFTSize, windowDuration, windowSmoothing } = optionsNormalized;

  const spectro = new Spectro({
    wSize: FFTSize,
    workers: 1,
    // wFunc: "Blackman",
  });

  const audioStream = bufferToStream(Buffer.from(audio.channelData.buffer));
  audioStream.pipe(spectro);

  console.log(">>> Starting processing", audio.channelData.length, audio.channelData.length / FFTSize);

  const spectrogramData2DRedundantData = await new Promise<number[][]>((resolve) => {
    let finishedAudioStream = false;
    let firstTime = true;
    audioStream.on("end", () => {
      finishedAudioStream = true;
    });
  
    spectro.on("end", (err, data: number[][]) => {
      if (finishedAudioStream !== true) return;

      if (firstTime) {
        firstTime = false;
        return;
      }
  
      // console.log(">>> data", data);
      // console.log(">>> HERE, data.length", data.length, "data[0].length", data[0].length);
      try {
        spectro.stop();
      } catch(err) {
        // Ignore
      }
      
      resolve(data);
    });
  });

  if (spectrogramData2DRedundantData.length === 0) {
    return {
      data: new Float64Array(),
      frequencyBinCount: FFTSize / 2,
      numberOfWindows: 0,
    };
  }

  const spectrogramData2D: number[][] = [];
  for (let i = 0; i < spectrogramData2DRedundantData.length; i++) {
    const bucketData = spectrogramData2DRedundantData[i];
    assert(bucketData.length === FFTSize);

    spectrogramData2D.push(bucketData.slice(0, FFTSize / 2));
  }

  const spectrogramData1D = spectrogramData2D.flat(1);
  const spectrogramData = new Float64Array(spectrogramData1D);

  console.log(">>> spectrogramData", spectrogramData);

  return {
    data: spectrogramData,
    frequencyBinCount: FFTSize / 2,
    numberOfWindows: spectrogramData2D.length,
  };

  // return {
  //   data: audio.channelData,
  //   frequencyBinCount: 0,
  //   numberOfWindows: 0,
  // };




  // const duration = AudioUtilities.getWavFileDuration(
  //   audio.channelData.length,
  //   sampleRate
  // );

  // // Calculate the total number of windows for the given audio source
  // const numWindows = Math.floor(duration / windowDuration);
  // const frequencyBinSize = Math.floor(FFTSize / 2);

  // const data = new Float64Array(numWindows * frequencyBinSize);

  // // console.log(">>> audio.channelData", audio.channelData); // TODO: remove

  // // Compute the frequency data for each of the windows
  // for (let currWindow = 0; currWindow < numWindows; currWindow++) {
  //   const frequencyData = computeFFTData(
  //     audio,
  //     sampleRate,
  //     currWindow,
  //     windowDuration,
  //     FFTSize
  //   );

  //   // TODO: remove
  //   console.log(">>> frequencyData.length", frequencyData.length);
  //   console.log(">>> frequencyData", frequencyData);

  //   // TODO: remove try catch
  //   try {
  //     data.set(frequencyData, currWindow * frequencyBinSize);
  //     // TODO: remove
  //     // for (let i = 0; i < frequencyBinSize; i++) {
  //     //   const j = currWindow * frequencyBinSize + i;
  //     //   data[j] = frequencyData[i];
  //     // }
  //   } catch (err) {
  //     console.log(
  //       ">>> frequencyData.length",
  //       frequencyData.length,
  //       currWindow,
  //       frequencyBinSize
  //     );
  //     throw err;
  //   }
  // }

  // return {
  //   numberOfWindows: numWindows,
  //   frequencyBinCount: frequencyBinSize,
  //   data,
  // };
}
