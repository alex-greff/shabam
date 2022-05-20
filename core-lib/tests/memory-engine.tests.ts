import { generateFingerprint } from "../src/fingerprint/generators/iterative.fingerprint-generator";
import { computeSpectrogramData } from "../src/fingerprint/node";
import { loadWavFileFromPath } from "../src/fingerprint/node/loader";
import { MemoryRecordsEngine } from "../src/search/engine-implementations/memory.engine";
import { FingerprintClass } from "../src/search/fingerprint-class";
import { RecordsTable } from "../src/search/records-table";
import path from "path";
import * as fs from "fs";
import * as bson from "bson";
import { SpectrogramData } from "../src/fingerprint/types";

const DATA_DIR = "./tests/data";

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

  // const valorFileName = "valor_clip_30sec.wav";
  // const valorFileName = "valor_clip_1min.wav";
  const valorFileName = "valor.wav";

  console.log("Loading Valor wav file...");
  let timerStart = performance.now();
  const valorWav = await loadWavFileFromPath(
    path.join(DATA_DIR, valorFileName),
    true
  );
  let timerEnd = performance.now();
  console.log(`> Done (${(timerEnd - timerStart)/1000}s)`);
  
  console.log("Computing Valor spectrogram...");
  timerStart = performance.now();
  // We need to cache the spectrogram b/c generating it currently is really slow
  let valorSpectrogram: SpectrogramData | null = await loadSpectrogramFromCache(
    valorFileName
  );
  if (valorSpectrogram === null) {
    valorSpectrogram = await computeSpectrogramData(valorWav);
    await saveSpectrogramToCache(valorSpectrogram, valorFileName);
  }
  timerEnd = performance.now();
  console.log(`> Done (${(timerEnd - timerStart)/1000}s)`);
  console.log(valorSpectrogram);

  console.log("Computing Valor fingerprint...");
  timerStart = performance.now();
  const valorFingerprint = await generateFingerprint(valorSpectrogram);
  timerEnd = performance.now();
  console.log(valorFingerprint);
  console.log(`> Done (${(timerEnd - timerStart)/1000}s)`);

  console.log("Computing Valor records table...");
  timerStart = performance.now();
  const valorRecordsTable = new RecordsTable(
    FingerprintClass.fromFingerprintInterface(valorFingerprint),
    1
  );
  timerEnd = performance.now();
  console.log(`> Done (${(timerEnd - timerStart)/1000}s)`);

  console.log("Storing Valor records...");
  timerStart = performance.now();
  await engine.storeRecords(valorRecordsTable, true);
  timerEnd = performance.now();
  console.log(`> Done (${(timerEnd - timerStart)/1000}s)`);

  console.log("Finished!");
})();
