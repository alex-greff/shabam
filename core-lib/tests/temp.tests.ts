import { loadSpectrogramFromCache } from "./utilities/spectrogram-cache";
import { renderSpectrogram } from "./utilities/spectrogram-renderer";
import { DATA_DIR } from "./utilities/constants";
import { assert } from "tsafe";
import { RecordsTable } from "../../build/Release/core_lib_native.node";

(async function () {
  // const spectrogram = await loadSpectrogramFromCache("valor_clip_30sec.wav", DATA_DIR);
  // assert(spectrogram !== null);

  // console.log(spectrogram);

  // await renderSpectrogram(spectrogram, "test.png", DATA_DIR);
  // console.log("Done!");
})();
