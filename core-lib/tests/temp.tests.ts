import { loadSpectrogramFromCache } from "./utilities/spectrogram-cache";
import { renderSpectrogram } from "./utilities/spectrogram-render";
import { DATA_DIR } from "./utilities/constants";
import { assert } from "tsafe";

(async function () {
  const spectrogram = await loadSpectrogramFromCache("valor_clip_30sec.wav", DATA_DIR);
  assert(spectrogram !== null);

  console.log(spectrogram);

  await renderSpectrogram(spectrogram, "valor_clip_30sec.png", DATA_DIR);
  console.log("Done!");
})();
