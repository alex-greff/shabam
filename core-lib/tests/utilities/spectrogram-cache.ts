import { SpectrogramData } from "../../src/fingerprint/types";
import * as fs from "fs";
import * as bson from "bson";
import path from "path";

export async function loadSpectrogramFromCache(
  fileName: string,
  dataDir: string,
): Promise<SpectrogramData | null> {
  const cacheFileName = `${fileName}.cache.bson`;

  try {
    const cacheFileBuff = await fs.promises.readFile(
      path.join(dataDir, cacheFileName)
    );

    interface BsonSpectrogramData {
      numberOfWindows: number;
      frequencyBinCount: number;
      data: bson.Binary;
    }

    const cache = bson.deserialize(cacheFileBuff) as BsonSpectrogramData;
    const dataBuf = cache.data.buffer;
    const data = new Float64Array(dataBuf);

    return {
      numberOfWindows: cache.numberOfWindows,
      frequencyBinCount: cache.frequencyBinCount,
      data,
    };
  } catch (err) {
    return null;
  }
}

export async function saveSpectrogramToCache(
  spectrogram: SpectrogramData,
  fileName: string,
  dataDir: string,
) {
  const cacheFileName = `${fileName}.cache.bson`;

  const spectrogramSerialized = bson.serialize(spectrogram);

  await fs.promises.writeFile(
    path.join(dataDir, cacheFileName),
    spectrogramSerialized
  );
}