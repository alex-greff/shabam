#include "preprocessing.hpp"
#include "AudioFile.h"
#include <cstdint>
#include <filesystem>
#include <liquid.h>
#include <string>
#include <vector>
#include <filesystem>

namespace shabam {
std::tuple<std::vector<float>, uint32_t> load_audio(std::string filepath) {
  if (!std::filesystem::exists(filepath)) {
    throw std::invalid_argument("Audio file '" + filepath + "' does not exist");
  }

  AudioFile<float> audioFile;
  audioFile.load(filepath);

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
      avgSample = avgSample / (float)numChannels;
      monoSignal[i] = avgSample;
    }
  }

  return {monoSignal, audioFile.getSampleRate()};
}

void save_audio(std::string filepath, std::vector<float> &samples,
                uint32_t sr) {
  // Ensure directories exist before saving audio file
  std::string directories = std::filesystem::path(filepath).parent_path();
  std::filesystem::create_directories(directories);

  AudioFile<float>::AudioBuffer buffer;
  buffer.resize(1);
  buffer[0].resize(samples.size());
  buffer[0] = samples;

  AudioFile<float> audioFile;
  audioFile.setBitDepth(16);
  audioFile.setSampleRate(sr);
  audioFile.setAudioBuffer(buffer);

  audioFile.save(filepath, AudioFileFormat::Wave);
}

std::vector<float> downsample_audio(std::vector<float> &samples,
                                    uint32_t original_sr, uint32_t target_sr) {
  // Resampling rate (output / input)
  float r = (float)target_sr / (float)original_sr;
  // Resampling filter stop-band attenuation [dB]
  // Just used value from documentation example:
  // https://liquidsdr.org/doc/msresamp/
  float As = 60.0f;
  msresamp_rrrf q = msresamp_rrrf_create(r, As);

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