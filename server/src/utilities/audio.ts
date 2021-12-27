import { Readable } from 'stream';

/**
 * Reads a readable stream into a buffer.
 */
// Source: https://stackoverflow.com/a/67729663/13161942
export function readableStreamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = [];

    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    stream.once('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    stream.once('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Gets the duration (in seconds) of a WAV file with the given number of samples
 * and sample rate.
 *
 * @param numberOfSamples The number of samples.
 * @param sampleRate The sample rate (Hz)
 */
export function getWavFileDuration(
  numberOfSamples: number,
  sampleRate: number,
): number {
  return numberOfSamples / sampleRate;
}
