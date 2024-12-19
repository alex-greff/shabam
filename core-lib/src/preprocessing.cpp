#include "AudioFile.h"
#include <filesystem>
#include <liquid.h>
#include <string>
#include <vector>

namespace shabam {
std::tuple<std::vector<float>, int> load_audio(std::string filepath) {
  if (!std::filesystem::exists(filepath)) {
    throw std::invalid_argument("Audio file '" + filepath + "' does not exist");
  }

  AudioFile<float> audioFile;
  audioFile.load(filepath);
  audioFile.printSummary(); // TODO: remove

  int numChannels = audioFile.getNumChannels();
  int numSamplesPerChannel = audioFile.getNumSamplesPerChannel();

  // Convert the signal to mono
  std::vector<float> monoSignal(numSamplesPerChannel);
  if (numSamplesPerChannel == 1) {
    // Optimization to just do a direct vector copy in the mono signal case
    monoSignal = audioFile.samples[0];
  } else {
    for (int i = 0; i < numSamplesPerChannel; i++) {
      float avgSample = 0.0;
      for (int c = 0; c < numChannels; c++) {
        avgSample += audioFile.samples[c][i];
      }
      avgSample = avgSample / (float) numChannels;
      monoSignal[i] = avgSample;
    }
  }

  return {monoSignal, audioFile.getSampleRate()};
}

std::vector<float> downsample_audio(std::vector<float> &samples,
                                     int original_sr, int target_sr) {
  // Resampling rate (output / input)
  float r = (float)target_sr / (float)original_sr;
  // Resampling filter stop-band attenuation [dB]
  // Just used value from documentation example: https://liquidsdr.org/doc/msresamp/
  float As = 60.0f;
  msresamp_rrrf q = msresamp_rrrf_create(r, As);
  msresamp_rrrf_print(q); // TODO: remove

  unsigned int nx = samples.size(); // input size
  unsigned int ny = ceilf(nx * r);  // expected output size
  unsigned int num_written;         // number of values written to buffer

  // Allocate vector for downsampled samples
  std::vector<float> ds_samples(ny);

  // Perform downsample operation
  msresamp_rrrf_execute(q, samples.data(), nx, ds_samples.data(), &num_written);

  // Free up resources
  msresamp_rrrf_destroy(q);

  return ds_samples;
}
} // namespace shabam