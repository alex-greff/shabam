import * as fs from "fs";
import * as bson from "bson";
import path from "path";
import { SpectrogramData } from "../../src/spectrogram/types";

// TODO: need to make a better cache system

export async function loadSpectrogramFromCache(
  fileName: string,
  dataDir: string
): Promise<SpectrogramData | null> {
  const cacheFileName = `${fileName}.cache.bson`;

  try {
    const cacheFileBuff = await fs.promises.readFile(
      path.join(dataDir, cacheFileName)
    );

    interface BsonSpectrogramData {
      numberOfWindows: number;
      frequencyBinCount: number;
      data: Record<number, number>;
    }

    const cache = bson.deserialize(cacheFileBuff) as BsonSpectrogramData;
    const data = new Float32Array(Object.values(cache.data));

    return {
      numWindows: cache.numberOfWindows,
      numBuckets: cache.frequencyBinCount,
      data,
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

  interface BsonSpectrogramDataIn {
    numberOfWindows: number;
    frequencyBinCount: number;
    data: Buffer;
  }

  const spectrogramBsonObj: BsonSpectrogramDataIn = {
    numberOfWindows: spectrogram.numWindows,
    frequencyBinCount: spectrogram.numBuckets,
    // data: spectrogram.data,
    data: Buffer.from(spectrogram.data),
  };

  const spectrogramSerialized = bson.serialize(spectrogramBsonObj);

  await fs.promises.writeFile(
    path.join(dataDir, cacheFileName),
    spectrogramSerialized
  );
}
