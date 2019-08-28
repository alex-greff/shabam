exports.getFingerprintBuffer = (createFingerprintReadStream) => {
    return new Promise((resolve, reject) => {
        const fingerprintReadStream = createFingerprintReadStream();

        const chunks = [];

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

exports.getFingerprintData = (fingerprintBuffer) => {
    return Uint8Array.from(fingerprintBuffer);
};