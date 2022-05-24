import { generateFingerprint } from "../src/fingerprint/generators/iterative.fingerprint-generator";
import { computeSpectrogramData } from "../src/fingerprint/node";
import { loadWavFileFromPath } from "../src/fingerprint/node/loader";
import { MemoryRecordsEngine } from "../src/search/engine-implementations/memory.engine";
import { FingerprintClass } from "../src/search/fingerprint-class";
import { RecordsTable, TrackRecordsTable } from "../src/search/records-table";
import path from "path";
import * as fs from "fs";
import * as bson from "bson";
import { performance } from "perf_hooks";
import { SpectrogramData } from "../src/fingerprint/types";
import { RecordsEngine } from "../src/search/engine";
import coreLibNative from "../build/Release/core_lib_native.node";

console.log("exports", coreLibNative);
console.log(coreLibNative.greetHello());

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

async function computeFingerprint(
  fileName: string,
  displayName: string,
  debugPrint = true
): Promise<FingerprintClass> {
  let timerStart = 0,
    timerEnd = 0;

  let spectrogram = await loadSpectrogramFromCache(fileName);
  if (debugPrint && spectrogram !== null)
    console.log(
      `Found cached spectrogram for ${displayName}, skipping wav file loading and spectrogram computation`
    );

  if (spectrogram === null) {
    // --- Load Wave file ---
    if (debugPrint) process.stdout.write(`Loading ${displayName} wav file... `);
    timerStart = performance.now();
    const wav = await loadWavFileFromPath(path.join(DATA_DIR, fileName), true);
    timerEnd = performance.now();
    if (debugPrint)
      process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);

    // --- Compute spectrogram or load from cache ---
    if (debugPrint)
      process.stdout.write(`Computing ${displayName} spectrogram... `);
    timerStart = performance.now();
    spectrogram = await computeSpectrogramData(wav);
    timerEnd = performance.now();
    // We need to cache the spectrogram b/c generating it currently is
    // really slow
    await saveSpectrogramToCache(spectrogram, fileName);
    if (debugPrint) {
      process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
      console.log(spectrogram);
    }
  }

  // --- Compute fingerprint ---
  if (debugPrint)
    process.stdout.write(`Computing ${displayName} fingerprint... `);
  timerStart = performance.now();
  const fingerprint = await generateFingerprint(spectrogram);
  timerEnd = performance.now();
  if (debugPrint) {
    process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
    console.log(fingerprint);
  }

  return FingerprintClass.fromFingerprintInterface(fingerprint);
}

(async function () {
  const engine = new MemoryRecordsEngine();
  let timerStart = 0,
    timerEnd = 0;

  // Load and store Valor in engine
  // const valorFileName = "valor_clip_30sec.wav";
  // const valorFileName = "valor_clip_1min.wav";
  const valorFileName = "valor.wav";
  const valorTrackId = 1;
  const valorFingerprint = await computeFingerprint(valorFileName, "Valor");
  process.stdout.write(`Computing Valor records table... `);
  timerStart = performance.now();
  const valorRecordsTable = new TrackRecordsTable(
    valorFingerprint,
    valorTrackId
  );
  timerEnd = performance.now();
  process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
  process.stdout.write("Storing Valor records... ");
  timerStart = performance.now();
  await engine.storeRecords(valorRecordsTable, true);
  timerEnd = performance.now();
  process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);

  // Load and store Frigid in engine
  const frigidFileName = "frigid.wav";
  const frigidTrackId = 2;
  const frigidFingerprint = await computeFingerprint(frigidFileName, "Frigid");
  process.stdout.write(`Computing Frigid records table... `);
  timerStart = performance.now();
  const frigidRecordsTable = new TrackRecordsTable(
    frigidFingerprint,
    frigidTrackId
  );
  timerEnd = performance.now();
  process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
  process.stdout.write("Storing Frigid records... ");
  timerStart = performance.now();
  await engine.storeRecords(frigidRecordsTable, true);
  timerEnd = performance.now();
  process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);

  // Load and search for Valor sample in engine
  const valorSampleFileName = "valor_clip_30sec.wav";
  const valorSampleFingerprint = await computeFingerprint(
    valorSampleFileName,
    "Valor Sample"
  );
  process.stdout.write(`Computing Valor Sample records table... `);
  timerStart = performance.now();
  const valorSampleRecordsTable = new RecordsTable(valorSampleFingerprint);
  timerEnd = performance.now();
  process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
  process.stdout.write("Searching records with Valor Sample... ");
  timerStart = performance.now();
  const matches = await engine.searchRecords(valorSampleRecordsTable);
  timerEnd = performance.now();
  process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
  console.log(matches);

  console.log("Finished!");
})();
