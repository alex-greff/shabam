import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { FingerprintInput } from './dto/fingerprint.inputs';
import { Fingerprint } from './fingerprint.types';

@Injectable()
export class FingerprintService {
  private async getFingerprintBuffer(
    createFingerprintReadStream: () => Readable,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const fingerprintReadStream = createFingerprintReadStream();

      const chunks: Uint8Array[] = [];

      fingerprintReadStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      fingerprintReadStream.once('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });

      fingerprintReadStream.once('error', (err) => {
        reject(err);
      });
    });
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
      fingerprintInput.frequencyBinCount,
      fingerprintInput.numberOfWindows,
      fingerprintData,
    );
  }
}
