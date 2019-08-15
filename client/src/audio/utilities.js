import CONSTANTS from "@/constants";

// ----------------
// --- Internal ---
// ----------------

// The possible compute type options available for _computeFFTData
const FFT_COMPUTE_TYPES = {
    BOTH: "both",
    FREQUENCY: "frequency",
    TIME_DOMAIN: "timedomain"
};

/**
 * 
 * @param {AudioBuffer} sourceAudioBuffer The source audio buffer.
 * @param {FFT_COMPUTE_TYPES} computeType 
 * @param {Number} windowIndex 
 * @param {Number} windowDuration The duration (seconds) of the window.
 * @param {Number} FFTSize 
 * @param {Number} windowSmoothing 
 */
async function _computeFFTData(sourceAudioBuffer, computeType, windowIndex, windowDuration = CONSTANTS.WINDOW_DURATION, FFTSize = CONSTANTS.FFT_SIZE, windowSmoothing = CONSTANTS.WINDOW_SMOOTHING) {
    // Initialize the empty windowed audio buffer
    const windowedAudioBuffer = new AudioBuffer({ 
        numberOfChannels: sourceAudioBuffer.numberOfChannels,
        length: Math.ceil(sourceAudioBuffer.sampleRate * windowDuration),
        sampleRate: sourceAudioBuffer.sampleRate,
    });

    // Populate it with the given window section
    copyWindow(sourceAudioBuffer, windowedAudioBuffer, windowIndex);

    // Construct the audio context
    const audioContext = new OfflineAudioContext(
        windowedAudioBuffer.numberOfChannels,
        windowedAudioBuffer.length,
        windowedAudioBuffer.sampleRate
    );

    // Setup the source and analizer nodes
    const sourceNode = new AudioBufferSourceNode(audioContext, { buffer: windowedAudioBuffer });
    const analyserNode = new AnalyserNode(audioContext, { fftSize: FFTSize, smoothingTimeConstant: windowSmoothing });
    
    sourceNode.connect(audioContext.destination);
    sourceNode.connect(analyserNode);
    sourceNode.start();

    // Render the audio
    await audioContext.startRendering();

    let ret = {};

    // Compute the frequency data, if needed
    if (computeType === FFT_COMPUTE_TYPES.BOTH || computeType === FFT_COMPUTE_TYPES.FREQUENCY) {
        const frequencyData = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(frequencyData);

        ret.frequencyData = frequencyData;
    }

    // Compute the time domain data, if needed
    if (computeType === FFT_COMPUTE_TYPES.BOTH || computeType === FFT_COMPUTE_TYPES.TIME_DOMAIN) {
        const timeDomainData = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteTimeDomainData(timeDomainData);

        ret.timeDomainData = timeDomainData;
    }

    return ret;
}

// ----------------
// --- External ---
// ----------------

/**
 * Returns a promise that resolves with an AudioBuffer instance downsampled to the target sample rate.
 * Adapted from https://stackoverflow.com/questions/27598270/resample-audio-buffer-from-44100-to-16000
 * 
 * @param {AudioBuffer} source The source audio buffer. 
 * @param {Number} targetSampleRate The targetted sample rate.
 * @return {AudioBuffer} The audio buffer with the downsampled audio data.
 */
export async function downsample(sourceAudioBuffer, targetSampleRate = CONSTANTS.TARGET_SAMPLE_RATE) {
    const audioContext = new OfflineAudioContext(
        sourceAudioBuffer.numberOfChannels, 
        sourceAudioBuffer.duration * sourceAudioBuffer.numberOfChannels * targetSampleRate, 
        targetSampleRate
    );

    const sourceNode = new AudioBufferSourceNode(audioContext, { buffer: sourceAudioBuffer });
    sourceNode.connect(audioContext.destination);
    sourceNode.start(0);

    const resampledAudioBuffer = await audioContext.startRendering();

    return resampledAudioBuffer;
}

/**
 * Copies over the audio buffer data from the given window index.
 * 
 * @param {AudioBuffer} sourceAudioBuffer The source audio buffer.
 * @param {AudioBuffer} targetAudioBuffer The target audio buffer.
 * @param {Number} windowIndex The index of the window.
 * @param {Number} windowDuration The duration (seconds) of the window.
 */
export function copyWindow(sourceAudioBuffer, targetAudioBuffer, windowIndex = 0, windowDuration = CONSTANTS.WINDOW_DURATION) {
    // Calculate the start index from where the copy will take place
    const startIndex = Math.floor(sourceAudioBuffer.sampleRate * windowIndex * windowDuration);
    
    // Copy each channel data over
    for (let channel = 0; channel < sourceAudioBuffer.numberOfChannels; channel++) {
        const targetChannelData = targetAudioBuffer.getChannelData(channel);
        sourceAudioBuffer.copyFromChannel(targetChannelData, channel, startIndex);
    }
}

/**
 * Computes and returns both the frequency and time domain data of the given source audio buffer.
 * 
 * @param {AudioBuffer} sourceAudioBuffer The source audio buffer.
 * @param {Number} windowIndex The index of the window to compute from.
 * @param {Number} windowDuration The duration (seconds) of the window.
 * @param {Number} FFTSize The number of samples in the FFT window.
 * @param {Number} windowSmoothing The smoothing value for the Blackman windowing function used internally by the WebAudio API.
 * @return {Object} Object of form { frequencyData: Unit8Array, timeDomainData: Unit8Array }
 */
export async function computeFFTData(sourceAudioBuffer, windowIndex = 0, windowDuration = CONSTANTS.WINDOW_DURATION, FFTSize = CONSTANTS.FFT_SIZE, windowSmoothing = CONSTANTS.WINDOW_SMOOTHING) {
    // Compute the frequency and time domain data
    return await _computeFFTData(sourceAudioBuffer, FFT_COMPUTE_TYPES.BOTH, windowIndex, windowDuration, FFTSize, windowSmoothing);
}

/**
 * Computes and returns a typed array containing the FFT frequency data for the given source audio buffer.
 * 
 * @param {AudioBuffer} sourceAudioBuffer The source audio buffer.
 * @param {Number} windowIndex The index of the window to compute from.
 * @param {Number} windowDuration The duration (seconds) of the window.
 * @param {Number} FFTSize The number of samples in the FFT window.
 * @param {Number} windowSmoothing The smoothing value for the Blackman windowing function used internally by the WebAudio API.
 * @return {Uint8Array} A typed array with the frequency data.
 */
export async function computeFrequencyData(sourceAudioBuffer, windowIndex = 0, windowDuration = CONSTANTS.WINDOW_DURATION, FFTSize = CONSTANTS.FFT_SIZE, windowSmoothing = CONSTANTS.WINDOW_SMOOTHING) {
    // Compute the frequency data
    const { frequencyData } = await _computeFFTData(sourceAudioBuffer, FFT_COMPUTE_TYPES.FREQUENCY, windowIndex, windowDuration, FFTSize, windowSmoothing);
    return frequencyData;
}

/**
 * Computes and returns a typed array containing the FFT time domain data for the given source audio buffer.
 * 
 * @param {AudioBuffer} sourceAudioBuffer The source audio buffer.
 * @param {Number} windowIndex The index of the window to compute from.
 * @param {Number} windowDuration The duration (seconds) of the window.
 * @param {Number} FFTSize The number of samples in the FFT window.
 * @param {Number} windowSmoothing The smoothing value for the Blackman windowing function used internally by the WebAudio API.
 * @return {Uint8Array} A typed array with the time domain data.

 */
export async function computeTimeDomainData(sourceAudioBuffer, windowIndex = 0, windowDuration = CONSTANTS.WINDOW_DURATION, FFTSize = CONSTANTS.FFT_SIZE, windowSmoothing = CONSTANTS.WINDOW_SMOOTHING) {
    // Compute the time domain data
    const { timeDomainData } = await _computeFFTData(sourceAudioBuffer, FFT_COMPUTE_TYPES.TIME_DOMAIN, windowIndex, windowDuration, FFTSize, windowSmoothing);
    return timeDomainData;
}

/**
 * 
 * @param {AudioBuffer} sourceAudioBuffer 
 * @param {Number} windowDuration The duration (seconds) of the window.
 * @param {Number} FFTSize The number of samples in the FFT window.
 * @param {Number} windowSmoothing The smoothing value for the Blackman windowing function used internally by the WebAudio API.
 * @return {Array} Returns an array of Uint8Array arrays.
 */
export async function computeSpectrogramData(sourceAudioBuffer, windowDuration = CONSTANTS.WINDOW_DURATION, FFTSize = CONSTANTS.FFT_SIZE, windowSmoothing = CONSTANTS.WINDOW_SMOOTHING) {
    // Calculate the total number of windows for the given audio source
    const numWindows = Math.floor(sourceAudioBuffer.duration / windowDuration);

    const spectrogramData = [];

    // Compute the frequency data for each of the windows
    for (let currWindow = 0; currWindow < numWindows; currWindow++) {
        const frequencyData = await computeFrequencyData(sourceAudioBuffer, currWindow, windowDuration, FFTSize, windowSmoothing);

        spectrogramData.push(frequencyData);
    }
    
    return spectrogramData;
}

export default {
    downsample,
    copyWindow,
    computeFFTData,
    computeFrequencyData,
    computeTimeDomainData,
    computeSpectrogramData,
};