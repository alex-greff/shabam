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
import {
  loadSpectrogramFromCache,
  saveSpectrogramToCache,
} from "./utilities/spectrogram-cache";
import { DATA_DIR } from "./utilities/constants";
import { renderSpectrogram } from "./utilities/spectrogram-renderer";
import { renderFingerprint } from "./utilities/fingerprint-renderer";

console.log("exports", coreLibNative);
console.log(coreLibNative.greetHello());

async function computeFingerprint(
  fileName: string,
  displayName: string,
  debugPrint = true
): Promise<FingerprintClass> {
  let timerStart = 0,
    timerEnd = 0;

  let spectrogram = await loadSpectrogramFromCache(fileName, DATA_DIR);
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
    await saveSpectrogramToCache(spectrogram, fileName, DATA_DIR);
    if (debugPrint) {
      process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
      // console.log(spectrogram); // TODO: remove
    }
  }

  // --- Render Spectrogram ---
  await renderSpectrogram(spectrogram, `${fileName}.spectrogram.png`, DATA_DIR);

  // --- Compute fingerprint ---
  if (debugPrint)
    process.stdout.write(`Computing ${displayName} fingerprint... `);
  timerStart = performance.now();
  const fingerprint = await generateFingerprint(spectrogram);
  timerEnd = performance.now();
  if (debugPrint) {
    process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
    // console.log(fingerprint); // TODO: remove
  }

  // --- Render Fingerprint ---
  await renderFingerprint(fingerprint, `${fileName}.fingerprint.png`, DATA_DIR);

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
  // process.stdout.write("Searching records with Valor Sample... ");
  // timerStart = performance.now();
  // const matches = await engine.searchRecords(valorSampleRecordsTable);
  // timerEnd = performance.now();
  // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
  // // console.log(matches); // TODO: remove

  console.log("Finished!"); // TODO: remove
})();
