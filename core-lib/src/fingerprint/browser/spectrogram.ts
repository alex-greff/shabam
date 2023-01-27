import { ComputeSpectrogramDataOptions, SpectrogramData } from "../types";
import { config } from "../../configuration";
import { isBrowser } from "browser-or-node";
import { assert } from "tsafe";

/**
 * Copies over the audio buffer data from the given window index for
 * the given duration.
 *
 * @param source The source audio buffer.
 * @param target The target audio buffer.
 * @param windowIndex The index of the window.
 * @param windowDuration The duration (seconds) of the window.
 */
function copyWindow(
  source: AudioBuffer,
  target: AudioBuffer,
  windowIndex: number,
  windowDuration: number
) {
  // Calculate the start index from where the copy will take place
  const startIndex = Math.floor(
    source.sampleRate * windowIndex * windowDuration
  );

  // Copy each channel data over
  for (let channel = 0; channel < source.numberOfChannels; channel++) {
    const targetChannelData = target.getChannelData(channel);
    source.copyFromChannel(targetChannelData, channel, startIndex);
  }
}

type AnalyzerDataComputeType = "both" | "frequency" | "timedomain";

interface ComputeFFTDataReturn {
  frequencyData?: Uint8Array;
  timeDomainData?: Uint8Array;
}

async function computeFFTData(
  source: AudioBuffer,
  computeType: AnalyzerDataComputeType,
  windowIndex: number,
  windowDuration: number,
  FFTSize: number,
  windowSmoothing: number
): Promise<ComputeFFTDataReturn> {
  // Initialize the empty windowed audio buffer
  const windowedAudioBuffer = new AudioBuffer({
    numberOfChannels: source.numberOfChannels,
    length: Math.ceil(source.sampleRate * windowDuration),
    sampleRate: source.sampleRate,
  });

  // Populate it with the given window section
  copyWindow(source, windowedAudioBuffer, windowIndex, windowDuration);

  // Construct the audio context
  const audioContext = new OfflineAudioContext(
    windowedAudioBuffer.numberOfChannels,
    windowedAudioBuffer.length,
    windowedAudioBuffer.sampleRate
  );

  // Setup the source and analyzer nodes
  const sourceNode = new AudioBufferSourceNode(audioContext, {
    buffer: windowedAudioBuffer,
  });
  const analyserNode = new AnalyserNode(audioContext, {
    fftSize: FFTSize,
    smoothingTimeConstant: windowSmoothing,
  });

  sourceNode.connect(audioContext.destination);
  sourceNode.connect(analyserNode);
  sourceNode.start();

  // Render the audio
  await audioContext.startRendering();

  let ret: ComputeFFTDataReturn = {};

  // Compute the frequency data, if needed
  if (computeType === "both" || computeType === "frequency") {
    const frequencyData = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(frequencyData);

    ret.frequencyData = frequencyData;
  }

  // Compute the time domain data, if needed
  if (computeType === "both" || computeType === "timedomain") {
    const timeDomainData = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteTimeDomainData(timeDomainData);

    ret.timeDomainData = timeDomainData;
  }

  return ret;
}

/**
 * Computes the spectrogram data of the given source audio buffer.
 *
 * @param source The source audio buffer.
 * @param options The configuration options.
 */
export async function computeSpectrogramData(
  source: AudioBuffer,
  options: Partial<ComputeSpectrogramDataOptions> = {}
): Promise<SpectrogramData> {
  assert(isBrowser);

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

  // Calculate the total number of windows for the given audio source
  const numWindows = Math.floor(source.duration / windowDuration);
  const frequencyBinSize = Math.floor(FFTSize / 2);

  const data = new Float64Array(numWindows * frequencyBinSize);

  // Compute the frequency data for each of the windows
  for (let currWindow = 0; currWindow < numWindows; currWindow++) {
    const { frequencyData } = await computeFFTData(
      source,
      "frequency",
      currWindow,
      windowDuration,
      FFTSize,
      windowSmoothing
    );

    data.set(frequencyData!, currWindow * frequencyBinSize);
  }

  return {
    numberOfWindows: numWindows,
    frequencyBinCount: frequencyBinSize,
    data,
  };
}
