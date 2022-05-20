import { generateFingerprint } from "../fingerprint/generators/iterative.fingerprint-generator";
import { computeSpectrogramData } from "../fingerprint/node";
import { loadWavFileFromPath } from "../fingerprint/node/loader";
import { MemoryRecordsEngine } from "../search/engine-implementations/memory.engine";
import { FingerprintClass } from "../search/fingerprint-class";
import { RecordsTable } from "../search/records-table";

(async function () {
  const engine = new MemoryRecordsEngine();

  console.log("Loading Valor wav file...");
  const valorWav = await loadWavFileFromPath("./src/tests/data/valor.wav");
  console.log("Computing Valor spectrogram...");
  const valorSpectrogram = await computeSpectrogramData(valorWav);
  console.log("Computing Valor fingerprint...");
  const valorFingerprint = await generateFingerprint(valorSpectrogram);
  console.log("Computing Valor records table...");
  const valorRecordsTable = new RecordsTable(
    FingerprintClass.fromFingerprintInterface(valorFingerprint),
    1
  );
  console.log("Storing Valor...");
  await engine.storeRecords(valorRecordsTable, true);

  console.log("Done!");
})();
