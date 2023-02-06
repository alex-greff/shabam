import * as fs from "fs";
import path from "path";
import { SpectrogramData } from "../../src/spectrogram/types";

// TODO: need to make a better cache system

interface SerializableSpectrogramData {
  numBuckets: number;
  numWindows: number;
  data: string;
}

export async function loadSpectrogramFromCache(
  fileName: string,
  dataDir: string
): Promise<SpectrogramData | null> {
  const cacheFileName = `${fileName}.cache.bson`;

  try {
    const spectrogramJsonStr = await fs.promises.readFile(
      path.join(dataDir, cacheFileName),
      "utf8"
    );

    const spectrogramSerializable: SerializableSpectrogramData =
      JSON.parse(spectrogramJsonStr);

    return {
      numBuckets: spectrogramSerializable.numBuckets,
      numWindows: spectrogramSerializable.numWindows,
      data: new Float32Array(
        Buffer.from(spectrogramSerializable.data, "base64")
      ),
    };
  } catch (err) {
    return null;
  }
}

export async function saveSpectrogramToCache(
  spectrogram: SpectrogramData,
  fileName: string,
  dataDir: string
) {
  const cacheFileName = `${fileName}.cache.bson`;

  const spectrogramSerializable: SerializableSpectrogramData = {
    numBuckets: spectrogram.numBuckets,
    numWindows: spectrogram.numWindows,
    data: Buffer.from(spectrogram.data.buffer).toString("base64"),
  };

  const spectrogramJsonStr = JSON.stringify(spectrogramSerializable);

  await fs.promises.writeFile(
    path.join(dataDir, cacheFileName),
    spectrogramJsonStr
  );
}
