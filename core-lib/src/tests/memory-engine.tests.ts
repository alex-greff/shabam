import { generateFingerprint } from "../fingerprint/generators/iterative.fingerprint-generator";
import { computeSpectrogramData } from "../fingerprint/node";
import { loadWavFileFromPath } from "../fingerprint/node/loader";
import { MemoryRecordsEngine } from "../search/engine-implementations/memory.engine";
import { FingerprintClass } from "../search/fingerprint-class";
import { RecordsTable } from "../search/records-table";
import path from "path";
import * as fs from "fs";
import * as bson from "bson";
import { SpectrogramData } from "../fingerprint/types";

const DATA_DIR = "./src/tests/data";

async function loadSpectrogramFromCache(
  fileName: string
): Promise<SpectrogramData | null> {
  const cacheFileName = `${fileName}.cache.bson`;

  try {
    const cacheFileBuff = await fs.promises.readFile(
      path.join(DATA_DIR, cacheFileName)
    );

    interface BsonSpectrogramData {
      numberOfWindows: number;
      frequencyBinCount: number;
      data: bson.Binary;
    }

    const cache = bson.deserialize(cacheFileBuff) as BsonSpectrogramData;

    return {
      numberOfWindows: cache.numberOfWindows,
      frequencyBinCount: cache.frequencyBinCount,
      data: cache.data.buffer,
    };
  } catch (err) {
    return null;
  }
}

async function saveSpectrogramToCache(
  spectrogram: SpectrogramData,
  fileName: string
) {
  const cacheFileName = `${fileName}.cache.bson`;

  const spectrogramSerialized = bson.serialize(spectrogram);

  await fs.promises.writeFile(
    path.join(DATA_DIR, cacheFileName),
    spectrogramSerialized
  );
}

(async function () {
  const engine = new MemoryRecordsEngine();

  const valorFileName = "valor_clip_30s.wav";
  console.log("Loading Valor wav file...");
  const valorWav = await loadWavFileFromPath(
    path.join(DATA_DIR, valorFileName),
    true
  );
  console.log("Computing Valor spectrogram...");
  // We need to cache the spectrogram b/c generating it currently is really slow
  let valorSpectrogram: SpectrogramData | null = await loadSpectrogramFromCache(
    valorFileName
  );
  if (valorSpectrogram === null) {
    valorSpectrogram = await computeSpectrogramData(valorWav);
    await saveSpectrogramToCache(valorSpectrogram, valorFileName);
  }
  console.log(valorSpectrogram);
  console.log("Computing Valor fingerprint...");
  const valorFingerprint = await generateFingerprint(valorSpectrogram);
  console.log(valorFingerprint);
  console.log("Computing Valor records table...");
  const valorRecordsTable = new RecordsTable(
    FingerprintClass.fromFingerprintInterface(valorFingerprint),
    1
  );
  console.log("Storing Valor...");
  await engine.storeRecords(valorRecordsTable, true);

  console.log("Done!");
})();
