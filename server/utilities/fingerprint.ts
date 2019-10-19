import { Readable } from "stream";

export function getFingerprintBuffer(createFingerprintReadStream: () => Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const fingerprintReadStream: Readable = createFingerprintReadStream();

        const chunks: Uint8Array[] = [];

        fingerprintReadStream.on("data", (chunk) => {
            chunks.push(chunk);
        });

        fingerprintReadStream.once("end", () => {
            const buffer = Buffer.concat(chunks);

            resolve(buffer);
        });

        fingerprintReadStream.once('error', (err) => {
            reject(err);
        });
    });
};

export function getFingerprintData(fingerprintBuffer: Buffer): Uint8Array {
    return Uint8Array.from(fingerprintBuffer);
};