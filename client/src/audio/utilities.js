import CONSTANTS from "@/constants";

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
 */
export function copyWindow(sourceAudioBuffer, targetAudioBuffer, windowIndex) {
    // Calculate the start index from where the copy will take place
    const startIndex = Math.floor(sourceAudioBuffer.sampleRate * windowIndex * CONSTANTS.WINDOW_DURATION);
    
    // Copy each channel data over
    for (let channel; channel < sourceAudioBuffer.numberOfChannels; channel++) {
        const targetChannelData = targetAudioBuffer.getChannelData(channel);
        sourceAudioBuffer.copyFromChannel(targetChannelData, channel, startIndex);
    }
}

const FFT_COMPUTE_TYPES = {
    BOTH: "both",
    FREQUENCY: "frequency",
    TIME_DOMAIN: "timedomain"
};

async function _computeFFTData(sourceAudioBuffer, computeTypes, FFTSize = CONSTANTS.FFT_SIZE, windowSmoothing = CONSTANTS.WINDOW_SMOOTHING) {
    const audioContext = new OfflineAudioContext(
        sourceAudioBuffer.numberOfChannels,
        sourceAudioBuffer.length,
        sourceAudioBuffer.sampleRate
    );

    const sourceNode = new AudioBufferSourceNode(audioContext, { buffer: sourceAudioBuffer });
    const analyserNode = new AnalyserNode(audioContext, { fftSize: FFTSize, smoothingTimeConstant: windowSmoothing });
    
    sourceNode.connect(audioContext.destination);
    sourceNode.connect(analyserNode);
    sourceNode.start();

    await audioContext.startRendering();

    let ret = {};

    if (computeTypes === FFT_COMPUTE_TYPES.BOTH || computeTypes === FFT_COMPUTE_TYPES.FREQUENCY) {
        const frequencyData = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(frequencyData);

        ret.frequencyData = frequencyData;
    }

    if (computeTypes === FFT_COMPUTE_TYPES.BOTH || computeTypes === FFT_COMPUTE_TYPES.TIME_DOMAIN) {
        const timeDomainData = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteTimeDomainData(timeDomainData);

        ret.timeDomainData = timeDomainData;
    }

    return ret;
}

/**
 * Computes and returns both the frequency and time domain data of the given source audio buffer.
 * 
 * @param {AudioBuffer} sourceAudioBuffer The source audio buffer.
 * @param {Number} FFTSize The size of the FFT window.
 * @param {Number} windowSmoothing The smoothing value for the Blackman windowing function used internally by the WebAudio API.
 * @return {Object} Object of form { frequencyData: Unit8Array, timeDomainData: Unit8Array }
 */
export async function computeFFTData(sourceAudioBuffer, FFTSize = CONSTANTS.FFT_SIZE, windowSmoothing = CONSTANTS.WINDOW_SMOOTHING) {
    // Compute the frequency and time domain data
    return await _computeFFTData(sourceAudioBuffer, FFT_COMPUTE_TYPES.BOTH, FFTSize, windowSmoothing);
}

/**
 * Computes and returns a typed array containing the FFT frequency data for the given source audio buffer.
 * 
 * @param {AudioBuffer} sourceAudioBuffer The source audio buffer.
 * @param {Number} FFTSize The size of the FFT window.
 * @param {Number} windowSmoothing The smoothing value for the Blackman windowing function used internally by the WebAudio API.
 * @return {Uint8Array} A typed array with the frequency data.
 */
export async function computeFrequencyData(sourceAudioBuffer, FFTSize = CONSTANTS.FFT_SIZE, windowSmoothing = CONSTANTS.WINDOW_SMOOTHING) {
    // Compute the frequency data
    const { frequencyData } = await _computeFFTData(sourceAudioBuffer, FFT_COMPUTE_TYPES.FREQUENCY, FFTSize, windowSmoothing);
    return frequencyData;
}

/**
 * Computes and returns a typed array containing the FFT time domain data for the given source audio buffer.
 * 
 * @param {AudioBuffer} sourceAudioBuffer 
 * @param {Number} FFTSize The size of the FFT window.
 * @param {Number} windowSmoothing The smoothing value for the Blackman windowing function used internally by the WebAudio API.
 * @return {Uint8Array} A typed array with the time domain data.

 */
export async function computeTimeDomainData(sourceAudioBuffer, FFTSize = CONSTANTS.FFT_SIZE, windowSmoothing = CONSTANTS.WINDOW_SMOOTHING) {
    // Compute the time domain data
    const { timeDomainData } = await _computeFFTData(sourceAudioBuffer, FFT_COMPUTE_TYPES.TIME_DOMAIN, FFTSize, windowSmoothing);
    return timeDomainData;
}

export function computeSpectrogram(sourceAudioBuffer, targetDataArray) {
    // Return typed array of sub-arrays 
}

export default {
    downsample,
    copyWindow,
    computeFFTData,
    computeFrequencyData,
    computeTimeDomainData,
    computeSpectrogram,
};