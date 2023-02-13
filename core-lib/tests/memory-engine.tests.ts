import { generateFingerprint } from "../src/fingerprint/generators/iterative.fingerprint-generator";
import { computeSpectrogramData } from "../src/spectrogram/spectrogram";
import { loadWavFileFromPath } from "../src/loader/loader";
import { MemoryRecordsEngine } from "../src/search/engine-implementations/memory.engine";
import { FingerprintClass } from "../src/search/fingerprint-class";
import { RecordsTable, TrackRecordsTable } from "../src/search/records-table";
import path from "path";
import { performance } from "perf_hooks";
import { RecordsEngine } from "../src/search/engine";
// import CoreLibNative from "../build/Release/core_lib_native.node";
import CoreLibNative from "../src/native";
import {
  loadSpectrogramFromCache,
  saveSpectrogramToCache,
} from "./utilities/spectrogram-cache";
import { DATA_DIR } from "./utilities/constants";
import { renderSpectrogram } from "./utilities/spectrogram-renderer";
import { renderFingerprint } from "./utilities/fingerprint-renderer";
import { renderTimeDomain } from "./utilities/time-domain-renderer";
import { computeFingerprint } from "../src/fingerprint/fingerprint";
import { config } from "../src";

// TODO: remove
console.log("exports", CoreLibNative);
console.log(CoreLibNative.greetHello());

async function _computeAndGetFingerprint(
  fileName: string,
  displayName: string,
  debugPrint = true
): Promise<CoreLibNative.Fingerprint> {
  let timerStart = 0,
    timerEnd = 0;

  // --- Load Wave file ---
  if (debugPrint) process.stdout.write(`Loading ${displayName} wav file... `);
  timerStart = performance.now();
  const wav = await loadWavFileFromPath(path.join(DATA_DIR, fileName), true);
  timerEnd = performance.now();
  if (debugPrint)
    process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);

  // --- Render Time Domain ---
  await renderTimeDomain(wav, `${fileName}.time-domain.png`, DATA_DIR);

  // TODO: remove
  // // --- Attempt to load spectrogram from cache ---
  // let spectrogram = await loadSpectrogramFromCache(fileName, DATA_DIR);
  // if (debugPrint && spectrogram !== null)
  //   console.log(
  //     `Found cached spectrogram for ${displayName}, skipping spectrogram computation`
  //   );

  // if (spectrogram === null) {
  //   // --- Compute spectrogram or load from cache ---
  //   if (debugPrint)
  //     process.stdout.write(`Computing ${displayName} spectrogram... `);
  //   timerStart = performance.now();
  //   spectrogram = await computeSpectrogramData(wav);
  //   timerEnd = performance.now();
  //   // We need to cache the spectrogram b/c generating it currently is
  //   // really slow
  //   await saveSpectrogramToCache(spectrogram, fileName, DATA_DIR);
  //   if (debugPrint) {
  //     process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
  //     // console.log(spectrogram); // TODO: remove
  //   }
  // }

  // --- Compute Spectrogram ---
  if (debugPrint)
    process.stdout.write(`Computing ${displayName} spectrogram... `);
  timerStart = performance.now();
  const spectrogram = await computeSpectrogramData(wav);
  timerEnd = performance.now();
  if (debugPrint) {
    process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
    // console.log(spectrogram); // TODO: remove
  }

  // --- Render Spectrogram ---
  await renderSpectrogram(spectrogram, `${fileName}.spectrogram.png`, DATA_DIR);

  // --- Compute fingerprint ---
  if (debugPrint)
    process.stdout.write(`Computing ${displayName} fingerprint... `);
  timerStart = performance.now();
  // TODO: remove
  // const fingerprint = await generateFingerprint(spectrogram);
  const [fingerprint, fingerprintData] = await computeFingerprint(spectrogram);
  timerEnd = performance.now();
  if (debugPrint) {
    process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
    // console.log(fingerprint); // TODO: remove
  }

  // --- Render Fingerprint ---
  await renderFingerprint(
    fingerprintData,
    `${fileName}.fingerprint.png`,
    DATA_DIR
  );

  return fingerprint;
}

(async function () {
  const engine = new CoreLibNative.MemoryRecordsEngine(
    config.searchConfig.targetZoneSize,
    config.searchConfig.searchSelectionCoefficient
  );
  console.log(
    "engine instanceof CoreLibNative.RecordsEngine",
    engine instanceof CoreLibNative.RecordsEngine
  );
  // const engine = new MemoryRecordsEngine();
  let timerStart = 0,
    timerEnd = 0;

  // --- Valor song ---
  // const valorFileName = "valor_clip_30sec.wav";
  // const valorFileName = "valor_clip_1min.wav";
  const valorFileName = "valor.wav";
  const valorTrackId = 1;
  const valorFingerprint = await _computeAndGetFingerprint(
    valorFileName,
    "Valor"
  );
  process.stdout.write(`Computing Valor records table... `);
  const valorRecordsTable = new CoreLibNative.RecordsTable(
    valorFingerprint,
    config.searchConfig.targetZoneSize
  );
  timerStart = performance.now();
  valorRecordsTable.compute();
  timerEnd = performance.now();
  process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
  // TODO: remove
  // const valorRecordsTable = new TrackRecordsTable(
  //   valorFingerprint,
  //   valorTrackId
  // );

  // process.stdout.write("Storing Valor records... ");
  // timerStart = performance.now();
  // await engine.storeRecords(valorRecordsTable, valorTrackId);
  // timerEnd = performance.now();
  // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);

  // // --- Frigid song ---
  // console.log()
  // const frigidFileName = "frigid.wav";
  // const frigidFingerprint = await _computeAndGetFingerprint(frigidFileName, "Frigid");
  // // const frigidTrackId = 2;
  // // process.stdout.write(`Computing Frigid records table... `);
  // // timerStart = performance.now();
  // // const frigidRecordsTable = new TrackRecordsTable(
  // //   frigidFingerprint,
  // //   frigidTrackId
  // // );
  // // timerEnd = performance.now();
  // // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
  // // process.stdout.write("Storing Frigid records... ");
  // // timerStart = performance.now();
  // // await engine.storeRecords(frigidRecordsTable, true);
  // // timerEnd = performance.now();
  // // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);

  // // --- Valor 30 second sample ---
  // console.log()
  // const valor30sSampleFileName = "valor_clip_30sec.wav";
  // const valor30sSampleFingerprint = await _computeAndGetFingerprint(
  //   valor30sSampleFileName,
  //   "Valor Sample (30s)"
  // );
  // // process.stdout.write(`Computing Valor Sample records table... `);
  // // timerStart = performance.now();
  // // const valorSampleRecordsTable = new RecordsTable(valor30sSampleFingerprint);
  // // timerEnd = performance.now();
  // // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
  // // process.stdout.write("Searching records with Valor Sample... ");
  // // timerStart = performance.now();
  // // const matches = await engine.searchRecords(valorSampleRecordsTable);
  // // timerEnd = performance.now();
  // // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
  // // console.log(matches); // TODO: remove

  // // --- Valor 2 second sample ---
  // console.log()
  // const valor2sSampleFileName = "valor_clip_2sec.wav";
  // const valor2sSampleFingerprint = await _computeAndGetFingerprint(
  //   valor2sSampleFileName,
  //   "Valor Sample (2s)"
  // );
  // // process.stdout.write(`Computing Valor Sample records table... `);
  // // timerStart = performance.now();
  // // const valor2sSampleRecordsTable = new RecordsTable(valor2sSampleFingerprint);
  // // timerEnd = performance.now();
  // // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);

  // // --- Sub test ---
  // console.log()
  // const subTestSampleFileName = "sub_test.wav";
  // const subTestSampleFingerprint = await _computeAndGetFingerprint(
  //   subTestSampleFileName,
  //   "Sub Test"
  // );
  // // process.stdout.write(`Computing Sub Text records table... `);
  // // timerStart = performance.now();
  // // const subeTestSampleRecordsTable = new RecordsTable(subTestSampleFingerprint);
  // // timerEnd = performance.now();
  // // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);

  // --- Sine test ---
  console.log();
  const sineTestSampleFileName = "sine_test.wav";
  const sineTestSampleFingerprint = await _computeAndGetFingerprint(
    sineTestSampleFileName,
    "Sine Test"
  );
  const sineTextRecordsTable = new CoreLibNative.RecordsTable(
    sineTestSampleFingerprint,
    config.TARGET_ZONE_SIZE
  );
  sineTextRecordsTable.compute();
  console.log(">>> sineTextRecordsTable", sineTextRecordsTable);

  // process.stdout.write(`Computing Sine Text records table... `);
  // timerStart = performance.now();
  // const sineTestSampleRecordsTable = new RecordsTable(
  //   sineTestSampleFingerprint
  // );
  // timerEnd = performance.now();
  // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);

  console.log("Finished!"); // TODO: remove
})();
