import { loadSpectrogramFromCache } from "./utilities/spectrogram-cache";
import { renderSpectrogram } from "./utilities/spectrogram-renderer";
import { DATA_DIR } from "./utilities/constants";
import { assert } from "tsafe";
import { RecordsTable } from "../../build/Release/core_lib_native.node";
import CoreLibNative from "../build/Release/core_lib_native.node";

console.log("exports", CoreLibNative);

(async function () {
  // const spectrogram = await loadSpectrogramFromCache("valor_clip_30sec.wav", DATA_DIR);
  // assert(spectrogram !== null);

  // console.log(spectrogram);

  // await renderSpectrogram(spectrogram, "test.png", DATA_DIR);
  // console.log("Done!");

  const encoded = CoreLibNative.RecordsEngine.encodeAddress(1, 2, 3);
  console.log(">>> encoded", encoded);
  const [anchorFreq, pointFreq, delta] = CoreLibNative.RecordsEngine.decodeAddress(encoded);
  console.log(`>>> decoded: (${anchorFreq}, ${pointFreq}, ${delta})`);
})();
