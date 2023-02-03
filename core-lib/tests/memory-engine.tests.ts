import { generateFingerprint } from "../src/fingerprint/generators/iterative.fingerprint-generator";
import { computeSpectrogramData } from "../src/spectrogram/spectrogram";
import { loadWavFileFromPath } from "../src/loader/loader";
import { MemoryRecordsEngine } from "../src/search/engine-implementations/memory.engine";
import { FingerprintClass } from "../src/search/fingerprint-class";
import { RecordsTable, TrackRecordsTable } from "../src/search/records-table";
import path from "path";
import { performance } from "perf_hooks";
import { RecordsEngine } from "../src/search/engine";
import CoreLibNative from "../build/Release/core_lib_native.node";
import {
  loadSpectrogramFromCache,
  saveSpectrogramToCache,
} from "./utilities/spectrogram-cache";
import { DATA_DIR } from "./utilities/constants";
import { renderSpectrogram } from "./utilities/spectrogram-renderer";
import { renderFingerprint } from "./utilities/fingerprint-renderer";
import { renderTimeDomain } from "./utilities/time-domain-renderer";
import { computeFingerprintData } from "../src/fingerprint/fingerprint";

// TODO: remove
console.log("exports", CoreLibNative);
console.log(CoreLibNative.greetHello());

async function computeFingerprint(
  fileName: string,
  displayName: string,
  debugPrint = true
): Promise<FingerprintClass> {
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
  const fingerprint = await computeFingerprintData(spectrogram);
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

  // --- Valor song ---
  // const valorFileName = "valor_clip_30sec.wav";
  // const valorFileName = "valor_clip_1min.wav";
  const valorFileName = "valor.wav";
  const valorTrackId = 1;
  const valorFingerprint = await computeFingerprint(valorFileName, "Valor");
  // process.stdout.write(`Computing Valor records table... `);
  // timerStart = performance.now();
  // const valorRecordsTable = new TrackRecordsTable(
  //   valorFingerprint,
  //   valorTrackId
  // );
  // timerEnd = performance.now();
  // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
  // process.stdout.write("Storing Valor records... ");
  // timerStart = performance.now();
  // await engine.storeRecords(valorRecordsTable, true);
  // timerEnd = performance.now();
  // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);

  // --- Frigid song ---
  const frigidFileName = "frigid.wav";
  const frigidTrackId = 2;
  const frigidFingerprint = await computeFingerprint(frigidFileName, "Frigid");
  // process.stdout.write(`Computing Frigid records table... `);
  // timerStart = performance.now();
  // const frigidRecordsTable = new TrackRecordsTable(
  //   frigidFingerprint,
  //   frigidTrackId
  // );
  // timerEnd = performance.now();
  // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
  // process.stdout.write("Storing Frigid records... ");
  // timerStart = performance.now();
  // await engine.storeRecords(frigidRecordsTable, true);
  // timerEnd = performance.now();
  // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);

  // --- Valor 30 second sample ---
  const valor30sSampleFileName = "valor_clip_30sec.wav";
  const valor30sSampleFingerprint = await computeFingerprint(
    valor30sSampleFileName,
    "Valor Sample"
  );
  // process.stdout.write(`Computing Valor Sample records table... `);
  // timerStart = performance.now();
  // const valorSampleRecordsTable = new RecordsTable(valor30sSampleFingerprint);
  // timerEnd = performance.now();
  // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
  // process.stdout.write("Searching records with Valor Sample... ");
  // timerStart = performance.now();
  // const matches = await engine.searchRecords(valorSampleRecordsTable);
  // timerEnd = performance.now();
  // process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);
  // console.log(matches); // TODO: remove

  // --- Valor 2 second sample ---
  const valor2sSampleFileName = "valor_clip_2sec.wav";
  const valor2sSampleFingerprint = await computeFingerprint(
    valor2sSampleFileName,
    "Valor Sample"
  );
  process.stdout.write(`Computing Valor Sample records table... `);
  timerStart = performance.now();
  const valor2sSampleRecordsTable = new RecordsTable(valor2sSampleFingerprint);
  timerEnd = performance.now();
  process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);

  // --- Sine test ---
  const sineTestSampleFileName = "sine_test.wav";
  const sineTestSampleFingerprint = await computeFingerprint(
    sineTestSampleFileName,
    "Sine Test"
  );
  process.stdout.write(`Computing Sine Text records table... `);
  timerStart = performance.now();
  const sineTestSampleRecordsTable = new RecordsTable(
    sineTestSampleFingerprint
  );
  timerEnd = performance.now();
  process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);

  // --- Sub test ---
  const subTestSampleFileName = "sub_test.wav";
  const subTestSampleFingerprint = await computeFingerprint(
    subTestSampleFileName,
    "Sub Test"
  );
  process.stdout.write(`Computing Sub Text records table... `);
  timerStart = performance.now();
  const subeTestSampleRecordsTable = new RecordsTable(subTestSampleFingerprint);
  timerEnd = performance.now();
  process.stdout.write(`done (${(timerEnd - timerStart) / 1000}s)\n`);

  console.log("Finished!"); // TODO: remove
})();
