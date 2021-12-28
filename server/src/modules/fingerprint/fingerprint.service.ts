import { BadRequestException, Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { Readable } from 'stream';
import { WaveFile } from 'wavefile';
import { FingerprintInput } from './dto/fingerprint.inputs';
import { Fingerprint } from './fingerprint.types';
import * as AudioUtilities from '@/utilities/audio';
import * as AudioConfig from '@/config/audio';
import { FFT } from 'dsp.js';
import { SpectrogramData } from '@shabam/fingerprint-lib';

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

@Injectable()
export class FingerprintService {
  private async getFingerprintBuffer(
    createFingerprintReadStream: () => Readable,
  ): Promise<Buffer> {
    return AudioUtilities.readableStreamToBuffer(createFingerprintReadStream());
  }

  async unwrapFingerprintInput(
    fingerprintInput: FingerprintInput,
  ): Promise<Fingerprint> {
    const {
      createReadStream: fingerprintDataReadStream,
    } = await fingerprintInput.fingerprintData;
    const fingerprintDataBuffer = await this.getFingerprintBuffer(
      fingerprintDataReadStream,
    );

    // Source: https://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
    const fingerprintData = new Uint32Array(
      fingerprintDataBuffer.buffer,
      fingerprintDataBuffer.byteOffset,
      fingerprintDataBuffer.byteLength / Uint32Array.BYTES_PER_ELEMENT,
    );

    return new Fingerprint(
      fingerprintInput.numberOfWindows,
      fingerprintInput.numberOfPartitions,
      fingerprintData,
    );
  }

  async loadAudioWav(
    fileUpload: FileUpload,
    doDownsample = true,
  ): Promise<WaveFile> {
    // Verify mimetype
    if (!AudioConfig.SUPPORTED_AUDIO_MIME_TYPES.includes(fileUpload.mimetype))
      throw new BadRequestException('Unsupported audio file');

    const fileBuffer = await AudioUtilities.readableStreamToBuffer(
      fileUpload.createReadStream(),
    );

    const wav = new WaveFile(fileBuffer);

    // Downsample the audio, if needed
    if (doDownsample) wav.toSampleRate(AudioConfig.TARGET_SAMPLE_RATE);

    return wav;
  }

  private computeFFTData(
    audio: WaveFile,
    sampleRate = AudioConfig.TARGET_SAMPLE_RATE,
    windowIndex: number,
    windowDuration: number,
    FFTSize: number,
  ): Float64Array {
    // Calculate the start index from where the copy will take place
    const startIndex = Math.floor(sampleRate * windowIndex * windowDuration);

    // TODO: only uses one channel at the moment
    // Create the buffer for the FFT
    const fftBuffer = Buffer.from(audio.getSamples()[0], startIndex, FFTSize);

    // Perform the FFT
    const fft = new FFT(FFTSize, sampleRate);
    fft.forward(fftBuffer);

    const spectrum = fft.spectrum;

    return spectrum;
  }

  async computeSpectrogramData(
    audio: WaveFile,
    sampleRate = AudioConfig.TARGET_SAMPLE_RATE,
    options: Partial<ComputeSpectrogramDataOptions> = {},
  ): Promise<SpectrogramData> {
    const defaultOptions: ComputeSpectrogramDataOptions = {
      windowDuration: AudioConfig.WINDOW_DURATION,
      FFTSize: AudioConfig.FFT_SIZE,
      windowSmoothing: AudioConfig.WINDOW_SMOOTHING,
    };

    const optionsNormalized: ComputeSpectrogramDataOptions = {
      ...defaultOptions,
      ...options,
    };
    const { FFTSize, windowDuration, windowSmoothing } = optionsNormalized;

    const duration = AudioUtilities.getWavFileDuration(
      audio.getSamples()[0].length,
      sampleRate,
    );

    // Calculate the total number of windows for the given audio source
    const numWindows = Math.floor(duration / windowDuration);
    const frequencyBinSize = Math.floor(FFTSize / 2);

    // TODO: should this be Float64Array instead???
    const data = new Uint8Array(numWindows * frequencyBinSize);

    // Compute the frequency data for each of the windows
    for (let currWindow = 0; currWindow < numWindows; currWindow++) {
      // TODO: remove
      // const { frequencyData } = await computeFFTData(
      //   source,
      //   'frequency',
      //   currWindow,
      //   windowDuration,
      //   FFTSize,
      //   windowSmoothing,
      // );

      const frequencyData = await this.computeFFTData(
        audio,
        sampleRate,
        currWindow,
        windowDuration,
        FFTSize,
      );

      data.set(frequencyData, currWindow * frequencyBinSize);
    }

    return {
      numberOfWindows: numWindows,
      frequencyBinCount: frequencyBinSize,
      data,
    };
  }
}
