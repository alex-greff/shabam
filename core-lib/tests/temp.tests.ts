import { loadSpectrogramFromCache } from "./utilities/spectrogram-cache";
import { renderSpectrogram } from "./utilities/spectrogram-renderer";
import { DATA_DIR } from "./utilities/constants";
import { assert } from "tsafe";

(async function () {
  const spectrogram = await loadSpectrogramFromCache("valor_clip_30sec.wav", DATA_DIR);
  assert(spectrogram !== null);

  console.log(spectrogram);

  await renderSpectrogram(spectrogram, "test.png", DATA_DIR);
  console.log("Done!");
})();
