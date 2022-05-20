import wavefile from "wavefile";
import * as fs from "fs";
import { config } from "../../configuration";

export async function loadWavFileFromPath(
  path: string,
  doDownsample = true
): Promise<wavefile.WaveFile> {
  const audioFileBuf = await fs.promises.readFile(path);

  const audioFile = new wavefile.WaveFile(audioFileBuf);
  if (doDownsample) audioFile.toSampleRate(config.TARGET_SAMPLE_RATE);

  return audioFile;
}
