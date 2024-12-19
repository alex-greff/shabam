#pragma once

#include <string>
#include <vector>
#include <cstdint>

namespace shabam {
/**
 * Loads an audio file from disk (supports WAV and AIFF)
 *
 * @param filepath Filepath to the audio file
 * @throws `std::invalid_argument` if the file cannot be read
 * @returns A tuple of `(std::vector samples, int sample_rate)`
 */
std::tuple<std::vector<float>, uint32_t> load_audio(std::string filepath);

/**
 * Saves a vector of samples to disk as a WAV file.
 *
 * @param filepath The filepath, including file name to save the audio file to
 * @param samples The vector of samples
 * @param sr The sample rate corresponding to the `samples` vector
 */
void save_audio(std::string filepath, std::vector<float> &samples, uint32_t sr);

/**
 * Downsamples a given sample vector to the target sample rate.
 *
 * @param samples The vector of samples
 * @param original_sr The sample rate of `samples`
 * @param target_sr The target sample rate to downsample to
 * @returns A vector of the downsampled samples
 */
std::vector<float> downsample_audio(std::vector<float> &samples,
                                    uint32_t original_sr, uint32_t target_sr);
} // namespace shabam