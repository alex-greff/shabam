/**
 * Returns a promise that resolves with an AudioBuffer instance downsampled to the target sample rate.
 * Adapted from https://stackoverflow.com/questions/27598270/resample-audio-buffer-from-44100-to-16000
 * 
 * @param {AudioBuffer} source The source audio buffer. 
 * @param {Number} targetSampleRate The targetted sample rate.
 */
async function downsample(sourceAudioBuffer, targetSampleRate = 16000) {
    const offlineCtx = new OfflineAudioContext(
        sourceAudioBuffer.numberOfChannels, 
        sourceAudioBuffer.duration * sourceAudioBuffer.numberOfChannels * targetSampleRate, 
        targetSampleRate
    );

    const offlineAudioBuffer = offlineCtx.createBuffer(
        sourceAudioBuffer.numberOfChannels, 
        sourceAudioBuffer.length, 
        sourceAudioBuffer.sampleRate
    );

    // Copy the source data into the offline target AudioBuffer
    for (let channel = 0; channel < sourceAudioBuffer.numberOfChannels; channel++) {
        offlineAudioBuffer.copyToChannel(sourceAudioBuffer.getChannelData(channel), channel);
    }

    // Render the resampled signal
    const targetSource = offlineCtx.createBufferSource();
    targetSource.buffer = sourceAudioBuffer;
    targetSource.connect(offlineCtx.destination);
    targetSource.start(0);
    
    const resampledAudioBuffer = await offlineCtx.startRendering();

    return resampledAudioBuffer;
}

export default downsample;