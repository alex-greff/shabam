import * as AudioConstants from "@/audio/constants";
import { SpectrogramData, PartitionRanges } from "@/audio/types";

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

/**
 * Returns a promise that resolves with an AudioBuffer instance downsampled
 * to the target sample rate.
 * Adapted from https://stackoverflow.com/questions/27598270/resample-audio-buffer-from-44100-to-16000
 *
 * @param  source The source audio buffer.
 * @param targetSampleRate The targeted sample rate.
 */
export async function downsample(
  source: AudioBuffer,
  targetSampleRate = AudioConstants.TARGET_SAMPLE_RATE
) {
  const audioContext = new OfflineAudioContext(
    source.numberOfChannels,
    source.duration * source.numberOfChannels * targetSampleRate,
    targetSampleRate
  );

  const sourceNode = new AudioBufferSourceNode(audioContext, {
    buffer: source,
  });
  sourceNode.connect(audioContext.destination);
  sourceNode.start(0);

  const resampledAudioBuffer = await audioContext.startRendering();
  return resampledAudioBuffer;
}

/**
 * Helper function used by computePartitionRanges to get the boundary indexes
 * of each partition range.
 */
function getBoundaryIndex(
  partitionIdx: number,
  totalPartitions: number,
  totalBins: number,
  partitionCurve: number
) {
  // Equation: y = b/(c-1)(c^(x/a)-1)
  //   where:
  //     a = number of partitions
  //     b = number of bins (FFT_size / 2)
  //     c = tension on the curve
  return Math.floor(
    (totalBins / (partitionCurve - 1)) *
      (Math.pow(partitionCurve, partitionIdx / totalPartitions) - 1)
  );
}

/**
 * Computes the partition ranges for the given FFT size in respect to the
 * number of partitions needed.
 * Returns an array of tuples (2 element arrays) of the computed
 * partition ranges.
 *
 * @param partitionAmount The number of partitions to split into.
 * @param FFTSize The size of the FFT window.
 * @param partitionCurve The curve that the partition ranges are calculated on.
 */
export function computePartitionRanges(
  partitionAmount = AudioConstants.FINGERPRINT_PARTITION_AMOUNT,
  FFTSize = AudioConstants.FFT_SIZE,
  partitionCurve = AudioConstants.FINGERPRINT_PARTITION_CURVE
): PartitionRanges {
  if (FFTSize / 2 <= 0)
    throw "Invalid number of bins, must have more than 0 bins";
  if (partitionAmount <= 0)
    throw "Invalid number of partitions, must have more than 0 partitions";

  const ret: PartitionRanges = [];

  // Calculate the boundary ranges for each partition
  for (let partitionIdx = 0; partitionIdx < partitionAmount; partitionIdx++) {
    const min = getBoundaryIndex(
      partitionIdx,
      partitionAmount,
      FFTSize / 2,
      partitionCurve
    );
    const max = getBoundaryIndex(
      partitionIdx + 1,
      partitionAmount,
      FFTSize / 2,
      partitionCurve
    );

    ret.push([min, max]);
  }

  return ret;
}

/**
 * Finds and returns the partition range for the given index.
 * @param index The index to search with.
 * @param partitions The partitions.
 */
export function findPartitionRange(index: number, partitions: PartitionRanges) {
  for (let i = 0; i < partitions.length; i++) {
    const currPartitionRange = partitions[i];
    const startIdx = currPartitionRange[0];
    const endIdx = currPartitionRange[1];

    // Found index
    if (index >= startIdx && index < endIdx) {
      return currPartitionRange;
    }
  }

  // Nothing was found
  return null;
}

export interface ComputeSpectrogramDataOptions {
  /** The durations (seconds) of the window */
  windowDuration: number;
  /** The number of samples in the FFT window */
  FFTSize: number;
  /** The smoothing value for the Blackman windowing function used internally
   *  by the WebAudio API.
   */
  windowSmoothing: number;
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
  const defaultOptions: ComputeSpectrogramDataOptions = {
    windowDuration: AudioConstants.WINDOW_DURATION,
    FFTSize: AudioConstants.FFT_SIZE,
    windowSmoothing: AudioConstants.WINDOW_SMOOTHING,
  };

  const optionsNormalized: ComputeSpectrogramDataOptions = {
    ...defaultOptions,
    ...options,
  };
  const { FFTSize, windowDuration, windowSmoothing } = optionsNormalized;

  // Calculate the total number of windows for the given audio source
  const numWindows = Math.floor(source.duration / windowDuration);
  const frequencyBinSize = Math.floor(FFTSize / 2);

  const data = new Uint8Array(numWindows * frequencyBinSize);

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

/**
 * Converts an audio blob into an audio buffer.
 *
 * @param blob The audio blob.
 */
export function convertBlobToAudioBuffer(blob: Blob): Promise<AudioBuffer> {
  return new Promise<AudioBuffer>((resolve, reject) => {
    const fileReader = new FileReader();
    const audioContext = new AudioContext();

    fileReader.onloadend = async () => {
      const arrayBuffer = fileReader.result as ArrayBuffer;

      try {
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        resolve(audioBuffer);
      } catch (err) {
        reject(err);
      }
    };

    // Load the blob
    fileReader.readAsArrayBuffer(blob);
  });
}
