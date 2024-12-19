#include <string>
#include <vector>

namespace shabam {
/**
 * Loads an audio file from disk (supports WAV and AIFF)
 * 
 * @param filepath Filepath to the audio file
 * @throws `std::invalid_argument` if the file cannot be read
 * @returns A tuple of `(std::vector samples, int sample_rate)`
 */
std::tuple<std::vector<float>, int> load_audio(std::string filepath);

/**
 * Downsamples a given sample vector to the target sample rate.
 * 
 * @param samples The vector of samples
 * @param original_sr The sample rate of `samples`
 * @param target_sr The target sample rate to downsample to
 * @returns A vector of the downsampled samples
 */
std::vector<float> downsample_audio(std::vector<float> &samples,
                                     int original_sr, int target_sr);
} // namespace shabam